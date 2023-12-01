from flask import Response, jsonify
import base64
from database import db, ObjectId
from user_functions import add_new_course
from pdfminer.high_level import extract_text

courses = db["Courses"]
users = db["Users"]

def new_syllabus(original):
    try:
        with open(original, "rb") as file:
            pdf = base64.b64encode(file.read()).decode('utf-8')
        txt = extract_text(original)
        return {
            "original": pdf,
            "pdf": pdf,
            "txt": txt
        }
    except:
        return Response(status=400)

def new_course(name, user_id, syllabus):
    try:
        course_id = ObjectId()
        instructor = users.find_one({"_id": user_id})
        courses.insert_one({
            "_id": course_id,
            "name": name,
            "instructor": {"_id": instructor["_id"], "name": instructor["name"], "email": instructor["email"]},
            "syllabus": new_syllabus(syllabus)
        })
        add_new_course(user_id, str(course_id))
        return Response(status=200)
    except:
        return Response(status=400)
    
def get_course_data(course_id):
    try:
        result = courses.find_one({"_id":ObjectId(course_id)})
        result["_id"] = course_id
        return jsonify(result)
    except:
        return Response(status=404)
    
def set_course(course_id, key, value):
    try:
        course = courses.find_one({"_id":ObjectId(course_id)})
    except:
        return Response(status=404)
    try:
        if key == "_id":
            return Response(status=400)
        elif key not in course.keys():
            return Response(status=404)
        elif key == "syllabus":
            value = new_syllabus(value)   
        courses.update_one({
            "_id": ObjectId(course_id)},
            {"$set": {key: value}
        })
        return Response(status=200)
    except:
        return Response(status=400)

def delete_course_data(course_id):
    try:
        courses.delete_one({"_id": ObjectId(course_id)})
        return Response(status=200)
    except:
        return Response(status=404)
    