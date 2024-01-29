import { UserInfo } from "../models/userModels";
import { QuestionInfo } from "../models/chatbotModels";

const FLASK_URL = 'https://syllapedia.azurewebsites.net';
// const FLASK_URL = 'http://localhost:5000'

export const getUser = async (id: string, authToken: string) => await get(`/user/${id}`, authToken);
export const getUserCourses = async (id: string, authToken: string) => await get(`/user/${id}/courses`, authToken);

export const createUser = async (info: UserInfo, authToken: string) => await post('/user', authToken, { "user_id": info._id, "name": info.name, "email": info.email });

export const askQuestion = async (info: QuestionInfo, authToken: string) => await post('/chat', authToken, { "user_id": info.userId, "course_id": info.courseId, "question": info.question }); 

async function get(url: string, authToken: string) {
    const requestInfo = { 
        method: "GET",
        headers: {
            "Authorization": "Bearer " + authToken
        } 
    };
    
    return await fetch(FLASK_URL + url, requestInfo)
        .then(response => response.json())
}

async function post(url: string, authToken: string, payload?: Object) {
    const requestInfo = { 
        method: "POST", 
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken
        },
        body: payload ? JSON.stringify(payload) : null
    };

    return await fetch(FLASK_URL + url, requestInfo)
        .then(response => response.json())
}

async function patch(url: string, authToken: string, payload?: Object) {
    const requestInfo = { 
        method: "PATCH", 
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken
        },
        body: payload ? JSON.stringify(payload) : null
    };

    return await fetch(FLASK_URL + url, requestInfo)
        .then(response => response.json())
}