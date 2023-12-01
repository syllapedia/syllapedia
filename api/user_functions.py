from flask import Response, jsonify
from database import db, ObjectId

courses = db["Courses"]
users = db["Users"]

def user_exists(user_id):
    return users.count_documents({"_id": user_id}) > 0

def course_exists(course_id):
    return courses.count_documents({"_id": course_id}) > 0

def new_user(user_id, name, email):
    if user_exists(user_id):
        return Response(status=200)
    try:
        users.insert_one({
            "_id": user_id,
            "name": name,
            "email": email,
            "permission": "",
            "courses": [],
            "prevHighlight": None
        })
        return Response(status=200)
    except:
        return Response(status=400)
    
def get_user_data(user_id):
    if not user_exists(user_id):
        return Response(status=404)
    try:
        result = users.find_one({"_id":user_id})
        for course in result["courses"]:
            course["_id"] = str(course["_id"])
        return jsonify(result)
    except:
        return Response(status=400)

def sanitize_courses(user_courses):
    exists = courses.find({"_id":{"$in":user_courses}})
    result = []
    for course in exists:
        course["_id"] = str(course["_id"])
        result.append(course)
    return result

def get_user_courses_data(user_id):
    try:
        user = users.find_one({"_id":user_id})
    except:
        return Response(status=404)
    try:
        sanitized_courses = sanitize_courses(user["courses"])
        return jsonify(sanitized_courses)
    except:
        return Response(status=400)
    
def set_user(user_id, key, value):
    if not user_exists(user_id):
        return Response(status=404)
    try:
        users.update_one(
            {"_id": user_id},
            {"$set": {key: value}
        })
        return Response(status=200)
    except:
        return Response(status=400)

def add_new_course(user_id, course_id):
    try:
        user = users.find_one({"_id": user_id})
    except:
        return Response(status=404)

    user_courses = user["courses"]
    if course_id not in user_courses:
        user_courses.append(ObjectId(course_id))
        users.update_one({"_id": user_id}, {"$set": {"courses": user_courses}})
        return Response(status=200)
    else:
        return Response(status=400)
    
def remove_course_data(user_id, course_id):
    try:
        user = users.find_one({"_id": user_id})
    except:
        return Response(status=404)

    user_courses = user["courses"]
    if course_id in user_courses:
        user_courses.remove(course_id)
        users.update_one({"_id": user_id}, {"$set": {"courses": user_courses}})
        return Response(status=200)
    else:
        return Response(status=400)
    
def course_substring_search(user_id, query):
    try:
        user = users.find_one({"_id": user_id})
    except:
        return Response(status=404)
    try:
        regex_query = {"name": {"$regex": query, "$options": "i"}}
        results = courses.find(regex_query)

        user_courses = user["courses"]
        filtered_results = []

        for course in results:
            if course["_id"] not in user_courses:
                course['_id'] = str(course['_id'])
                filtered_results.append(course)

        return jsonify(filtered_results)
    except:
        return Response(status=400)
    
def delete_user_data(user_id):
    try:
        users.delete_one({"_id": user_id})
        return Response(status=200)
    except:
        return Response(status=404)
