from flask import Response, jsonify, json
import requests
import base64
from database import db
from graph_db_functions import add_course_node, remove_course_node, remove_syllabus
from bson.objectid import ObjectId
from user_functions import add_new_course
import fitz
from authorization import env_keys

courses = db["Courses"]
users = db["Users"]

def user_exists(user_id):
    # Checks if user exists
    return users.count_documents({"_id": user_id}) > 0

def course_exists(course_id):
    # Checks if a course exists
    return courses.count_documents({"_id": ObjectId(course_id)}) > 0

def course_name_exists(name):
    # Checks if a course exists
    return courses.count_documents({"name": name}) > 0

def sanitize_course(course):
    course["_id"] = str(course["_id"])
    return course

def to_pdf(file, file_type):
    # Converts file to PDF
    api_key = env_keys["API2PDF_KEY"]
    if file_type == "html":
        endpoint = "https://v2.api2pdf.com/chrome/pdf/html"
    api_response = requests.post(endpoint, json={file_type: file}, headers={"Authorization": api_key})
    response_url = json.loads(api_response.content)["FileUrl"]
    
    # Gets the PDF bytes
    pdf_bytes = requests.get(response_url).content
    
    # Encodes the PDF output as base64
    pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
    
    return pdf_base64
    
def new_syllabus(original64, file_type):
    # Converts original into a pdf
    if file_type == "application/pdf":
        pdf = original64
    elif file_type == "text/html":
        # Decodes the base64 HTML input to get the HTML string
        html_bytes = base64.b64decode(original64)
        html_string = html_bytes.decode("utf-8")
        pdf = to_pdf(html_string, "html")
    else:
        raise ValueError("Unsupported file type. Please provide a '.pdf' or '.html' file.")

    # Converts pdf to a string of text
    pdf_data = base64.b64decode(pdf)
    doc = fitz.open(stream=pdf_data, filetype="pdf")
    txt = ""
    for page in doc:
        txt += page.get_text() + "\n"

    # Returns syllabi
    return {
        "pdf": pdf,
        "txt": txt
    }

def new_course(user_id, subject, number, title, syllabus):
    # Checks if instructor does not exist
    if not user_exists(user_id):
        return Response("Could not find instructor", 404)
    
    # Creates course name
    name = subject + " " + number + " - " + title

    # Checks if course already exists
    if courses.find_one({"name": name, "instructor._id": user_id}):
        return jsonify("Course already exists"), 200

    try:
        # Generates course id and gets instructor
        course_id = ObjectId()
        instructor = users.find_one({"_id": user_id})

        # Creates a new course
        syllabus = new_syllabus(syllabus["base64"], syllabus["fileType"])
        new_course = {
            "_id": course_id,
            "name": name,
            "subject": subject,
            "number": number,
            "title": title,
            "instructor": {"_id": instructor["_id"], "name": instructor["name"], "email": instructor["email"]},
            "syllabus": syllabus
        }
        courses.insert_one(new_course)
        add_course_node(str(course_id), user_id, name, syllabus["txt"])

        # Adds new course into instructor's courses
        add_new_course(user_id, course_id)

        # Returns sanitized new course
        return jsonify(sanitize_course(new_course)), 200
    except:
        return Response("Course could not be created", 400)
    
def get_course_data(course_id):
    # Checks if course does not exist
    if not course_exists(course_id):
        return Response("Course could not found", 404)
    
    try:
        # Gets course
        course = sanitize_course(courses.find_one({"_id": ObjectId(course_id)}))

        # Returns course
        return jsonify(course), 200
    except:
        return Response("Could not get course", 400)
    
def set_course(course_id, data):
    try:
        # Checks that course exists
        course = courses.find_one({"_id":ObjectId(course_id)})
    except:
        return Response("Course could not be found", 404)
    
    try:
        # Creates tuple containing properties that will be updated with updated values
        update_data = {}

        # Prepares update data
        for key, value in data.items():
            if key not in ["subject", "number", "title", "syllabus"]:
                return Response("Invalid Property", 400)
            if key != "syllabus":
                update_data[key] = value
                course[key] = value
            else:
                remove_syllabus(course_id)
                update_data[key] = new_syllabus(course_id, value["base64"], value["fileType"])

        # Updates name if necessary
        if not set(data.keys()).isdisjoint(["subject", "number", "title"]):
            update_data["name"] = f"{course['subject']} {course['number']} - {course['title']}"

        # Updates the course
        courses.update_one({"_id": ObjectId(course_id)}, {"$set": update_data})

        # Return updated course
        return get_course_data(course_id)
    except:
        return Response("Course could not be updated", 400)


def delete_course_data(course_id):
    try:
        # Deletes course
        courses.delete_one({"_id": ObjectId(course_id)})

        remove_course_node(course_id)

        return Response(status=200)
    except:
        return Response("Course could not be found", 404)
    