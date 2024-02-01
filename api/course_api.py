from flask import request
from apiflask import APIBlueprint
from course_functions import set_course, new_course, get_course_data, delete_course_data
from authorization import authorize

course_api = APIBlueprint("course_api", __name__)

@course_api.route("/course", methods=["POST"])
def create_course():
    def action():
        data = request.get_json()
        # Creates a course and returns the created course
        return new_course(data["user_id"], data["subject"], data["number"], data["title"], data["syllabus"])
    
    return authorize(action)

@course_api.route("/course/<course_id>", methods=["GET"])
def get_course(course_id):
    def action():
        # Returns a course
        return get_course_data(course_id)
    
    return authorize(action)

@course_api.route("/course/<course_id>", methods=["PATCH"])
def update_course(course_id):
    def action():
        data = request.get_json()
        # Updates a value in a course
        return set_course(course_id, data)
    
    return authorize(action)

@course_api.route("/course/<course_id>", methods=["DELETE"])
def delete_course(course_id):
    def action():
        # Deletes a course 
        return delete_course_data(course_id)

    return authorize(action)