from flask import Response, jsonify
from database import db
from bson.objectid import ObjectId

courses = db["Courses"]
users = db["Users"]

def user_exists(user_id):
    # Checks if user exists
    return users.count_documents({"_id": user_id}) > 0

def course_exists(course_id):
    # Checks if a course exists
    return courses.count_documents({"_id": ObjectId(course_id)}) > 0

def sanitize_user(user):
    # Gets all user courses that exist in courses
    try: 
        exists = courses.find({"_id": {"$in": user["courses"]}})
    except:
        exists = []

    # Coverts user courses that exist from ObjectIds to strings
    sanitized_user_courses = []
    for course in exists:
        sanitized_user_courses.append(str(course["_id"]))
    user["courses"] = sanitized_user_courses

    # Returns user
    return user

def course_substring_search(user_id, query):
    # Checks if user does not exist
    if not course_exists(user_id):
        return Response("User could not found", 404)
    
    try:
        # Gets valid courses
        filter_query = {"name": {"$regex": query, "$options": "i"}}
        valid_courses = courses.find(filter_query)

        # Gets user courses
        user = users.find_one({"_id": user_id})
        user_courses = user["courses"]
        
        # Gets user courses in valid courses
        filtered_courses = []
        for course in valid_courses:
            if course["_id"] not in user_courses:
                course['_id'] = str(course['_id'])
                filtered_courses.append(course)

        # Return filtered courses
        return jsonify(filtered_courses), 200
    except:
        return Response("Course substring search properly did not execute properly", 400)

def new_user(user_id, name, email):
    # Checks if user exists
    if user_exists(user_id):
        return get_user_data(user_id)
    
    try:
        # Creates new user
        new_user = {
            "_id": user_id,
            "name": name,
            "email": email,
            "permission": "",
            "courses": [],
            "prevHighlight": None
        }
        users.insert_one(new_user)

        # Returns new user
        return jsonify(new_user), 200
    except:
        return Response("User could not be created", 400)
    
def get_user_data(user_id):
    # Checks if user does not exist
    if not user_exists(user_id):
        return Response("User could not found", 404)
    
    try:
        # Gets user and sanitizes
        user = users.find_one({"_id": user_id})
        sanitized_user = sanitize_user(user)

        # Returns user
        return jsonify(sanitized_user), 200
    except:
        return Response("Could not get user", 400)

def get_user_courses_data(user_id):
    # Checks if user does not exist
    if not user_exists(user_id):
        return Response("User could not found", 404)
       
    try:
        # Gets user and sanitizes courses
        user = users.find_one({"_id": user_id})
        sanitized_courses = sanitize_user(user)["courses"]

        # Returns sanitized user courses
        return jsonify(sanitized_courses), 200
    except:
        return Response("Could not get user courses", 400)
    
def set_user(user_id, key, value):
    # Checks if user does not exist
    if not user_exists(user_id):
        return Response("User could not found", 404)
    try:
        # Updates value for key
        users.update_one(
            {"_id": user_id},
            {"$set": {key: value}
        })

        # Returns user
        return get_user_data(user_id)
    except:
        return Response("User could not be updated", 400)

def add_new_course(user_id, course_id):
    # Checks if user does not exist
    if not user_exists(user_id):
        return Response("User could not found", 404)

    # Gets user courses
    user_courses = users.find_one({"_id": user_id})["courses"]

    # Checks if course is not in user courses
    if course_id not in user_courses:
        # Adds course to user courses
        user_courses.append(ObjectId(course_id))
        users.update_one({"_id": user_id}, {"$set": {"courses": user_courses}})

        # Returns user
        return get_user_data(user_id)
    else:
        return Response(status=400)
    
def remove_course_data(user_id, course_id):
    # Checks if user does not exist
    if not user_exists(user_id):
        return Response("User could not found", 404)

    # Gets user courses
    user_courses = users.find_one({"_id": user_id})["courses"]

    # Checks if course is in user courses
    if ObjectId(course_id) not in user_courses:
        return Response("Course is not in user courses", 404)
    
    try:
        # Removes course from user courses
        user_courses.remove(ObjectId(course_id))
        users.update_one({"_id": user_id}, {"$set": {"courses": user_courses}})
        return Response(status=200)
    except:
        return Response("Course could not be removed", 400)
    
def delete_user_data(user_id):
    # Checks if user does not exist
    if not user_exists(user_id):
        return Response("User could not found", 404)
    
    try:
        # Deletes user
        users.delete_one({"_id": user_id})
        return Response(status=200)
    except:
        return Response("User could not be deleted", 400)
