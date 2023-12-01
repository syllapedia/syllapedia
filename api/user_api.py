from flask import request
from user_functions import new_user, get_user_data, set_user, add_new_course, remove_course_data, delete_user_data, course_substring_search, get_user_courses_data
from apiflask import APIBlueprint

user_api = APIBlueprint("user_api", __name__)

@user_api.route("/user", methods=["POST"])
def create_user():
    data = request.get_json()

    return new_user(data["user_id"], data["name"], data["email"])

@user_api.route("/user/<user_id>/courses", methods=["POST"])
def add_user_course(user_id):
    data = request.get_json()

    return add_new_course(user_id, data["course_id"])

@user_api.route("/user/<user_id>", methods=["GET"])
def get_user(user_id):

    return get_user_data(user_id)

@user_api.route("/user/<user_id>/courses/", methods=["GET"])
def get_user_courses(user_id):

    return get_user_courses_data(user_id)

@user_api.route("/user/<user_id>/courses/search", methods=["GET"])
def search_available_courses(user_id):
    query = request.args.get('query')

    return course_substring_search(user_id, query)

@user_api.route("/user/<user_id>", methods=["PATCH"])
def update_user(user_id):
    data = request.get_json()

    return set_user(user_id, data["key"], data["value"])

@user_api.route("/user/<user_id>", methods=["DELETE"])
def delete_user(user_id):

    return delete_user_data(user_id)

@user_api.route("/user/<user_id>/courses/<course_id>", methods=["DELETE"])
def remove_user_course(user_id, course_id):

    return remove_course_data(user_id, course_id)
