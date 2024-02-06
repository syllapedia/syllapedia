import { UserInfo } from "../models/userModels";
import { QuestionInfo } from "../models/chatbotModels";
import { createCourseInfo, setCourseInfo, courseQuery } from "../models/courseModels";

// const FLASK_URL = 'https://syllapedia.azurewebsites.net';
const FLASK_URL = 'http://localhost:5000'

export const getUser = async (id: string, authToken: string) => await get(`/user/${id}`, authToken);
export const getUserCourses = async (id: string, authToken: string) => await get(`/user/${id}/courses`, authToken);
export const addUserCourse = async (id: string, info: {course_id: string}, authToken: string) => await post(`/user/${id}/courses`, authToken, info);
export const removeUserCourse = async (id: string, courseId: string, authToken: string) => await del(`/user/${id}/courses/${courseId}`, authToken);
export const deleteUser = async (userId: string, authToken: string) => await del(`/user/${userId}`, authToken);
export const createCourse = async (info: createCourseInfo, authToken: string) => await post('/course', authToken, {"subject": info.subject, "number": info.number, "title": info.title, "user_id": info.user_id, "syllabus": info.syllabus});
export const setCourse = async (courseId: string, info: setCourseInfo, authToken: string) => await patch(`/course/${courseId}`, authToken, info);
export const deleteCourse = async (courseId: string, authToken: string) => await del(`/course/${courseId}`, authToken);
export const userSearchCourses = async (id: string, query: courseQuery, authToken: string) => {
    const queryString = new URLSearchParams(query as Record<string, string>).toString();
  
    return await get(`/user/${id}/courses/search?${queryString}`, authToken);
}
export const createUser = async (info: UserInfo, authToken: string) => await post('/user', authToken, { "user_id": info._id, "name": info.name, "email": info.email });
export const askQuestion = async (info: QuestionInfo, authToken: string) => await post('/chat', authToken, { "course_id": info.courseId, "question": info.question }); 

async function get(url: string, authToken: string) {
    const requestInfo = { 
        method: "GET",
        headers: {
            "Authorization": "Bearer " + authToken
        }, 
    };
    
    return await fetch(FLASK_URL + url, requestInfo)
        .then(response => response.json());
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
        .then(response => response.json());
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
        .then(response => response.json());
}

async function del(url: string, authToken: string) {
    const requestInfo = { 
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + authToken
        }, 
    };
    
    return await fetch(FLASK_URL + url, requestInfo)
}
