from flask import Response, jsonify
import base64
from database import db
from bson.objectid import ObjectId
from user_functions import add_new_course
from pdfminer.high_level import extract_text

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

def new_syllabus(original):
    # Converts original syllabus into a pdf 
    with open(original, "rb") as file:
        pdf = base64.b64encode(file.read()).decode('utf-8')

    # Converts pdf to a string of text
    txt = extract_text(original)

    # Returns syllabi
    return {
        "original": pdf,
        "pdf": pdf,
        "txt": txt
    }

def new_course(subject, course_number, course_title, user_id, syllabus):
    # Checks if instructor does not exist
    if not user_exists(user_id):
        return Response("Could not find instructor", 404)
    
    # Creates course name
    name = subject + course_number + " - " + course_title

    try:
        # Gets course by name and instructor
        course = courses.find_one({"name": name, "instructor._id": user_id})

        # Returns sanitized course
        return sanitize_course(course), 200
    
    except:    
        try:
            # Generates course id and gets instructor
            course_id = ObjectId()
            instructor = users.find_one({"_id": user_id})

            # Creates a new course
            new_course = {
                "_id": course_id,
                "name": name,
                "subject": subject,
                "course_number": course_number,
                "course_title": course_title,
                "instructor": {"_id": instructor["_id"], "name": instructor["name"], "email": instructor["email"]},
                "syllabus": new_syllabus(syllabus)
            }
            courses.insert_one(new_course)

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
    
def set_course(course_id, key, value):
    try:
        # Gets course
        course = courses.find_one({"_id":ObjectId(course_id)})
    except:
        return Response("Course could not be found", 404)
    
    try:
        if key == "_id":
            return Response("Course id cannot be changed", 400)
        elif key not in course.keys():
            return Response("Invalid course key", 404)
        elif key == "syllabus":
            try:
                value = new_syllabus(value)
            except:
                return Response("Invalid syllabus", 400)
        # Updates value for key
        courses.update_one({
            "_id": ObjectId(course_id)},
            {"$set": {key: value}
        })
        
        # Returns course
        return get_course_data(course_id)
    except:
        return Response("Course could not be updated", 400)

def delete_course_data(course_id):
    try:
        # Deletes course
        courses.delete_one({"_id": ObjectId(course_id)})
        return Response(status=200)
    except:
        return Response("Course could not be found", 404)
    