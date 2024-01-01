from flask import request
from user_functions import new_user, get_user_data, set_user, add_new_course, remove_course_data, delete_user_data, course_search, get_user_courses_data
from apiflask import APIBlueprint

user_api = APIBlueprint("user_api", __name__)

@user_api.route("/user", methods=["POST"])
def create_user():
    data = request.get_json()
    # Creates a user and returns the created user
    return new_user(data["user_id"], data["name"], data["email"])

@user_api.route("/user/<user_id>/courses", methods=["POST"])
def add_user_course(user_id):
    data = request.get_json()
    # Adds new a course to a user
    return add_new_course(user_id, data["course_id"])

@user_api.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):
    # Returns a user
    return get_user_data(user_id)

@user_api.route("/user/<user_id>/courses/", methods=["GET"])
def get_user_courses(user_id):
    # Returns a user's courses
    return get_user_courses_data(user_id)

@user_api.route("/user/<user_id>/courses/search", methods=["GET"])
def search_available_courses(user_id):
    data = request.get_json()
    # Searches and returns courses in user courses with query
    # Filters by course subject, course number, and/or course_title
    return course_search(user_id, data)

@user_api.route("/user/<user_id>", methods=["PATCH"])
def update_user(user_id):
    data = request.get_json()
    # Updates a value in a user
    return set_user(user_id, data["key"], data["value"])

@user_api.route("/user/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    # Deletes a user
    return delete_user_data(user_id)

@user_api.route("/user/<user_id>/courses/<course_id>", methods=["DELETE"])
def remove_user_course(user_id, course_id):
    # Deletes a course in a user
    return remove_course_data(user_id, course_id)
