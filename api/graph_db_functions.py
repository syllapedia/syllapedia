from uuid import uuid4
from database import graph_db
from openai import OpenAI
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from semantic_text_splitter import TextSplitter

client = OpenAI()

def get_db(user_id):
    # Gets graph db for visualization
    with graph_db.session() as session:
        result = session.execute_read(_nodes_relations, user_id)
        return result

def _nodes_relations(tx, user_id, k=100):
    # Gets all of the questions that are asked for a course and instructed by the user
    # Orders questions by frequency and get the top-k
    # Gets all similarity relations of the questions
    query = """
    MATCH (q: Question)-[Asked_For]->(c: Course)<-[Instructs]-(i: Instructor {id: $id})
    WITH q, i, c
    ORDER BY q.frequency DESC
    LIMIT $k
    OPTIONAL MATCH (q)-[similar_to:Similar_To]->(q2:Question)
    RETURN q, i, similar_to, c
    """
    result = tx.run(query, id=user_id, k=k).data()
    
    # Filters for duplicates
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
    
    # Returns a list of nodes and relations
    return {"nodes": nodes, "relations": relations}

def add_instructor_node(user_id, name):
    # Adds an instructor node
    with graph_db.session() as session:
        session.execute_write(_create_instructor_node, user_id, name)

def _create_instructor_node(tx, user_id, name):
    # Creates an instructor with a unique id and a name
    query = (
        "CREATE (i:Instructor {id: $id, name: $name})"
    )
    tx.run(query, id=user_id, name=name)

def remove_instructor_node(user_id):
    # Removes an instructor
    with graph_db.session() as session:
        session.execute_write(_delete_instructor_node, user_id)

def _delete_instructor_node(tx, user_id):
    # Gets instructor, all of its courses, and all of the questions associated with the course
    # Deletes all nodes
    query = (
        "MATCH (i:Instructor {id: $id})"
        "OPTIONAL MATCH (i)-[:Instructs]->(c:Course)"
        "OPTIONAL MATCH (q:Question)-[:Asked_For]->(c)"
        "DETACH DELETE i, c, q"
    )
    tx.run(query, id=user_id)

def add_course_node(course_id, user_id, name):
    # Adds a course node
    with graph_db.session() as session:
        session.execute_write(_create_course_node, course_id, user_id, name)

def _create_course_node(tx, course_id, user_id, name):
    # Finds the corresponding instructor node
    # Creates course node with a unique id, the instructor's id, and course name
    # Creates a relation with the instructor
    query = (
        "MATCH (i:Instructor {id: $user_id})"
        "CREATE (c:Course {id: $course_id, user_id: $user_id, name: $name})"
        "MERGE (i)-[:Instructs]->(c)"
    )
    tx.run(query, course_id=course_id, user_id=user_id, name=name)

def remove_course_node(course_id):
    # Removes a course node
    # Removes syllabus chunks associated with course
    with graph_db.session() as session:
        session.execute_write(_delete_course_node, course_id)
        session.execute_write(_delete_syllabus, course_id)

def _delete_course_node(tx, course_id):
    # Finds the course node and all of its questions
    # Deletes the course node and questions
    query = (
        "MATCH (c:Course {id: $id})"
        "OPTIONAL MATCH (q:Question)-[:Asked_For]->(c)"
        "DETACH DELETE c, q"
    )
    tx.run(query, id=course_id)

def add_question_node(question, course_id, success):
    # Embeds question as a vector
    response = client.embeddings.create(
        input=question,
        model="text-embedding-3-small"
    )
    vector = response.data[0].embedding

    # Adds a question node
    with graph_db.session() as session:
        # Checks if the question already exists
        existing_question = session.execute_write(_find_existing_question, question, course_id)

        if existing_question:
            # Updates the preexisting question's frequency, success, and success_rate
            session.execute_write(_update_existing_question, question, course_id, success)
        else:
            # Creates a questions node
            session.execute_write(_create_question_node, question, vector, course_id, success)

            # Finds similar questions 
            similar_questions = session.execute_write(_find_similar_questions, vector, course_id, question)

            #Creates a similarity relation between similar questions
            for similar_question in similar_questions:
                session.execute_write(_create_similar_to_relation, {"text": question, "course_id": course_id}, similar_question)

def _find_existing_question(tx, question, course_id):
    # Finds the question that corresponds to a question text and course_id
    query = (
        "MATCH (q:Question {text: $text, course_id: $course_id})"
        "RETURN q"
    )
    result = tx.run(query, text=question, course_id=course_id)

    # Returns whether the question exists
    return result.single() is not None

def _update_existing_question(tx, question, course_id, success):
    # Finds the preexisting question node
    # Increments frequency and success and updates success_rate
    query = (
        "MATCH (q:Question {text: $text, course_id: $course_id}) "
        "SET q.frequency = q.frequency + 1, "
            "q.success = q.success + $success, "
            "q.success_rate = (q.success + $success) / (q.frequency + 1)"
    )
    tx.run(query, text=question, course_id=course_id, success=success)

def _create_question_node(tx, question, vector, course_id, success):
    # Creates a unique question id
    id = str(uuid4())
    
    # Finds the course node that corresponds to a course_id
    # Creates a question with a unique id, question text, embedding vector,... 
    # ...course_id, question frequency, total successful responses, and success rate
    query = (
        "MATCH (c:Course {id: $course_id})"
        "CREATE (q:Question {id: $id, text: $question, vector: $vector, course_id: $course_id, frequency: 1, success: $success, success_rate: $success_rate})"
        "MERGE (q)-[:Asked_For]->(c)"
    )
    tx.run(query, id=id, question=question, vector=vector, course_id=course_id, success=success, success_rate=float(success))

def remove_question_node(text, course_id):
    # Removes a question node
    with graph_db.session() as session:
        session.execute_write(_delete_question_node, text, course_id)

def _delete_question_node(tx, text, course_id):
    # Finds the question that corresponds to a question text and course_id
    # Deletes the question
    query = (
        "MATCH (q:Question {text: $text, course_id: $course_id})"
        "DETACH DELETE q"
    )
    tx.run(query, text=text, course_id=course_id)

def _find_similar_questions(tx, vector, course_id, query, k=4):
    # Finds every question that is associated with a course_id
    # Returns an array of dictionaries with text, course_id, and vector keys
    query = (
        "MATCH (q:Question {course_id: $course_id})"
        "RETURN q.text AS text, q.course_id AS course_id, q.vector AS vector"
    )
    results = tx.run(query, course_id=course_id).data()
    
    # Gets a list of tuples containing each question's question text and their similarity to the query
    similarities = []
    new_vector = np.array(vector).reshape(1, -1)
    for result in results:
        existing_vector = np.array(result["vector"]).reshape(1, -1)
        similarity = cosine_similarity(new_vector, existing_vector)[0][0]
        if result["text"] != query and result["course_id"] != course_id: 
            similarities.append((result["text"], similarity))
    
    # Sorts questions by similarity and gets top-k
    similarities.sort(key=lambda x: x[1], reverse=True)
    top_similarities = similarities[:k] if len(similarities) > k else similarities

    # Returns a list of dictionaries that represent questions that are above some similarity threshold
    return [dict(text=text, course_id=course_id) for text, similarity in top_similarities if similarity > 0.5]

def _create_similar_to_relation(tx, question1, question2):
    # Finds two questions that correspond to question text and a course_id
    # Creates a similarity relation between them
    query = (
        "MATCH (q1:Question {text: $question1.text, course_id: $question1.course_id}), (q2:Question {text: $question2.text, course_id: $question2.course_id})"
        "MERGE (q1)-[:Similar_To]->(q2)"
    )
    tx.run(query, question1=question1, question2=question2)

def create_syllabus(course_id, syllabus):
    # Splits a syllabus string into chunks of text
    splitter = TextSplitter.from_tiktoken_model("gpt-3.5-turbo")
    chunks = splitter.chunks(syllabus, 500)

    # Embeds syllabus chunks
    with graph_db.session() as session:
        session.execute_write(_embed_chunks, course_id, chunks)

def _embed_chunks(tx, course_id, chunks):
    # Embeds each syllabus chunk
    embeds = [embed.embedding for embed in client.embeddings.create(
        input=chunks,
        model="text-embedding-3-small"
    ).data]

    # Creates a list of dictionaries with a chunk of text and an embedding vector
    text_vectors = [{"text": chunk, "vector": vector} for chunk, vector in zip(chunks, embeds)]

    # For each text_vector, creates a syllabus node with a course_id that corresponds to...
    # ...the course that the syllabus is for, syllabus text, and an embedding vector
    query = (
        "UNWIND $text_vectors AS text_vector "
        "CREATE (s: Syllabus {course_id: $course_id, text: text_vector.text, vector: text_vector.vector})"
    )
    tx.run(query, course_id=course_id, text_vectors=text_vectors)

def remove_syllabus(course_id):
    # Removes a course's syllabus nodes
    with graph_db.session() as session:
        session.execute_write(_delete_syllabus, course_id)

def _delete_syllabus(tx, course_id):
    # Finds and deletes all syllabus nodes that are associated with a course_id
    query = (
        "MATCH (s: Syllabus {course_id: $course_id})"
        "DETACH DELETE s"
    )
    tx.run(query, course_id=course_id)  

def context_search(query, course_id, k=4):
    # Embeds the query
    query_vector = client.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    ).data[0].embedding
    
    # Gets all of the syllabus chunks
    with graph_db.session() as session:
        syllabus_chunks = session.execute_read(_fetch_syllabus_chunks, course_id)

    # Creates a list of tuples with a syllabus chunk and its similarity to the query
    query_vector_np = np.array(query_vector).reshape(1, -1)
    similarities = []
    for chunk in syllabus_chunks:
        chunk_vector_np = np.array(chunk["vector"]).reshape(1, -1)
        similarity = cosine_similarity(query_vector_np, chunk_vector_np)[0][0]
        similarities.append((chunk, similarity))
    
    # Sorts the list of tuples by similarity
    similarities.sort(key=lambda x: x[1], reverse=True)
    
    # Returns top-k similar chunks
    return [item[0]["text"] for item in similarities[:k]]

def _fetch_syllabus_chunks(tx, course_id):
    # Finds every syllabus that is associated with a course id
    # Returns an array of dictionaries with id, course_id, text, and vector keys
    query = (
        "MATCH (s: Syllabus {course_id: $course_id})"
        "RETURN s.id AS id, s.course_id AS course_id, s.text AS text, s.vector AS vector"
    )
    result = tx.run(query, course_id=course_id).data()
    return result
