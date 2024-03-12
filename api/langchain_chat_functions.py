from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List
from database import db
from authorization import env_keys

courses = db["Courses"]

class ChatResponse(BaseModel):
    answer: str = Field(description="answer to the query")
    sources: List[str] = Field(description="sources for the answer") 
    status: int = Field(description="the status of the response") 

def langchain_chat_respond(syllabus, query):
    try:
        # Creates output parser
        parser = JsonOutputParser(pydantic_object=ChatResponse)

        # Creates prompt
        prompt = PromptTemplate(
            input_variables=["role", "instructions", "syllabus", "query"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
            template="""
            Role: {role}
            Instructions: {instructions}
            Syllabus: {syllabus}
            Query: {query}
            """
        )

        # Gets LLM
        llm = ChatOpenAI(model="gpt-3.5-turbo")

        # Creates langchain chain
        chain = prompt | llm | parser

        # Gets response
        response = chain.invoke({"role": env_keys["LLM_ROLE"], "instructions": env_keys["LLM_INSTRUCTIONS"], "syllabus": syllabus, "query": query})
        answer = response["answer"]
        sources = response["sources"]
        status = response["status"]

        # Returns answer, sources, and whether response executed successfully
        return {"answer": answer, "sources": sources, "status": status}
    except:
        return {"answer": "Response Failed to Complete", "sources": "Response Failed to Complete", "status": 400}