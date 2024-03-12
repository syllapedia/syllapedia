from flask import request
from graph_db_functions import get_db
from apiflask import APIBlueprint
from authorization import authorize

graph_db_api = APIBlueprint("graph_db_api", __name__)

@graph_db_api.route("/graph_db/<user_id>", methods=["GET"])
def get_graph_db(user_id):
    def action():
        # Gets graph db data for user
        return get_db(user_id)
    
    return authorize(action)
