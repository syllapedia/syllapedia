import uuid
from database import graph_db, client
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def get_db(user_id):
    with graph_db.session() as session:
        result = session.read_transaction(_nodes_relations, user_id)
        return result

def _nodes_relations(tx, user_id, k=100):
    query = """
    MATCH (q: Question)-[Asked_For]->(c: Course)<-[Instructs]-(i: Instructor {id: $id})
    WITH q, i, c
    ORDER BY q.frequency DESC
    LIMIT $k
    OPTIONAL MATCH (q)-[similar_to:Similar_To]->(q2:Question)
    RETURN q, i, similar_to, c
    """
    result = tx.run(query, id=user_id, k=k).data()
    
    nodes = []
    relations = []
    unique_nodes = set()

    for record in result:
        i_node = record["i"]
        c_node = record["c"]
        q_node = record["q"]
        
        if i_node["id"] not in unique_nodes:
            nodes.append({"id": i_node["id"], "name": i_node["name"], "label": "Instructor"})
            unique_nodes.add(i_node["id"])
        
        if c_node["id"] not in unique_nodes:
            nodes.append({"id": c_node["id"], "name": c_node["name"], "label": "Course"})
            relations.append({"source": c_node["user_id"], "target": c_node["id"], "type": "Instructs"})
            unique_nodes.add(c_node["id"])

        if q_node["id"] not in unique_nodes:
            nodes.append({"id": q_node["id"], "text": q_node["text"], "frequency": q_node["frequency"], "success_rate": q_node["success_rate"], "label": "Question"})
            relations.append({"source": q_node["id"], "target": c_node["id"], "type": "Asked_For"})
            unique_nodes.add(q_node["id"])
        
        if "similar_to" in record and record["similar_to"] is not None:
            relations.append({"source": q_node["id"], "target": record["similar_to"][0]["id"], "type": "Similar_To"})
    
    return {"nodes": nodes, "relations": relations}

def add_instructor_node(user_id, name):
    with graph_db.session() as session:
        session.write_transaction(_create_instructor_node, user_id, name)

def _create_instructor_node(tx, user_id, name):
    query = (
        "CREATE (i:Instructor {id: $id, name: $name})"
    )
    tx.run(query, id=user_id, name=name)

def remove_instructor_node(user_id):
    with graph_db.session() as session:
        session.write_transaction(_delete_instructor_node, user_id)

def _delete_instructor_node(tx, user_id):
    query = (
        "MATCH (i:Instructor {id: $id})"
        "OPTIONAL MATCH (i)-[:Instructs]->(c:Course)"
        "OPTIONAL MATCH (q:Question)-[:Asked_For]->(c)"
        "DETACH DELETE i, c, q"
    )
    tx.run(query, id=user_id)

def add_course_node(course_id, user_id, name):
    with graph_db.session() as session:
        session.write_transaction(_create_course_node, course_id, user_id, name)

def _create_course_node(tx, course_id, user_id, name):
    query = (
        "MATCH (i:Instructor {id: $user_id})"
        "CREATE (c:Course {id: $course_id, user_id: $user_id, name: $name})"
        "MERGE (i)-[:Instructs]->(c)"
    )
    tx.run(query, course_id=course_id, user_id=user_id, name=name)

def remove_course_node(course_id):
    with graph_db.session() as session:
        session.write_transaction(_delete_course_node, course_id)

def _delete_course_node(tx, course_id):
    query = (
        "MATCH (c:Course {id: $id})"
        "OPTIONAL MATCH (q:Question)-[:Asked_For]->(c)"
        "DETACH DELETE c, q"
    )
    tx.run(query, id=course_id)

def add_question_node(question, course_id, success):
    response = client.embeddings.create(
        input=question,
        model="text-embedding-3-small"
    )
    vector = response.data[0].embedding 
    with graph_db.session() as session:
        existing_question = session.write_transaction(_find_existing_question, question, course_id)

        if existing_question:
            session.write_transaction(_update_existing_question, question, course_id, success)
        else:
            session.write_transaction(_create_question_node, question, vector, course_id, success)
            similar_questions = session.write_transaction(_find_similar_questions, vector, course_id, question)
            for similar_question in similar_questions:
                session.write_transaction(_create_similar_to_relation, {"text": question, "course_id": course_id}, similar_question)

def _find_existing_question(tx, question, course_id):
    query = (
        "MATCH (q:Question {text: $text, course_id: $course_id})"
        "RETURN q"
    )
    result = tx.run(query, text=question, course_id=course_id)
    return result.single() is not None

def _update_existing_question(tx, question, course_id, success):
    query = (
        "MATCH (q:Question {text: $text, course_id: $course_id}) "
        "SET q.frequency = q.frequency + 1, "
            "q.success = q.success + $success, "
            "q.success_rate = (q.success + $success) / (q.frequency + 1)"
    )
    tx.run(query, text=question, course_id=course_id, success=success)

def _create_question_node(tx, question, vector, course_id, success):
    id = str(uuid.uuid4())
    query = (
        "MATCH (c:Course {id: $course_id})"
        "CREATE (q:Question {id: $id, text: $question, vector: $vector, course_id: $course_id, frequency: 1, success: $success, success_rate: $success_rate})"
        "MERGE (q)-[:Asked_For]->(c)"
    )
    tx.run(query, id=id, question=question, vector=vector, course_id=course_id, success=success, success_rate=float(success))

def remove_question_node(text, course_id):
    with graph_db.session() as session:
        session.write_transaction(_delete_question_node, text, course_id)

def _delete_question_node(tx, text, course_id):
    query = (
        "MATCH (q:Question {text: $text, course_id: $course_id})"
        "DETACH DELETE q"
    )
    tx.run(query, text=text, course_id=course_id)

def _find_similar_questions(tx, vector, course_id, current_question, k=3):
    query = (
        "MATCH (q:Question {course_id: $course_id})"
        "RETURN q.text AS text, q.course_id AS course_id, q.vector AS vector"
    )
    results = tx.run(query, course_id=course_id).data()
    
    similarities = []
    new_vector = np.array(vector).reshape(1, -1)
    for result in results:
        existing_vector = np.array(result["vector"]).reshape(1, -1)
        similarity = cosine_similarity(new_vector, existing_vector)[0][0]
        if result["text"] != current_question: 
            similarities.append((result["text"], similarity))
    
    similarities.sort(key=lambda x: x[1], reverse=True)
    top_similarities = similarities[:k] if len(similarities) > k else similarities
    return [dict(text=text, course_id=course_id) for text, similarity in top_similarities if similarity > 0.5]

def _create_similar_to_relation(tx, question1, question2):
    query = (
        "MATCH (q1:Question {text: $question1.text, course_id: $question1.course_id}), (q2:Question {text: $question2.text, course_id: $question2.course_id})"
        "MERGE (q1)-[:Similar_To]->(q2)"
    )
    tx.run(query, question1=question1, question2=question2)