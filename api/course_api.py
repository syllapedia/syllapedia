from flask import request
from apiflask import APIBlueprint
from course_functions import set_course, new_course, get_course_data, delete_course_data

course_api = APIBlueprint("course_api", __name__)

@course_api.route("/course", methods=["POST"])
def create_course():
    data = request.get_json()
    # Creates a course and returns the created course
    return new_course(data["subject"], data["course_number"], data["course_title"], data["user_id"], data["syllabus"])

@course_api.route("/course/<course_id>", methods=["GET"])
def get_course(course_id):
    # Returns a course
    return get_course_data(course_id)

@course_api.route("/course/<course_id>", methods=["PATCH"])
def update_course(course_id):
    data = request.get_json()
    # Updates a value in a course
    return set_course(course_id, data["key"], data["value"])

@course_api.route("/course/<course_id>", methods=["DELETE"])
def delete_course(course_id):
    # Deletes a course
    return delete_course_data(course_id)
