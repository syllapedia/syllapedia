import { UserInfo } from "../models/userModels";
import { QuestionInfo } from "../models/chatbotModels";
import { createCourseInfo, setCourseInfo, courseQuery } from "../models/courseModels";

const FLASK_URL = 'https://syllapedia.azurewebsites.net';
// const FLASK_URL = 'http://localhost:5000';

let controller = new AbortController();

export const abortHttpRequests = () => {
    controller.abort();
    controller = new AbortController();
}
export const getUser = async (id: string, authToken: string) => await httpGet(`/user/${id}`, authToken);
export const getUserCourses = async (id: string, authToken: string) => await httpGet(`/user/${id}/courses`, authToken);
export const addUserCourse = async (id: string, info: {course_id: string}, authToken: string) => await httpPost(`/user/${id}/courses`, authToken, info);
export const removeUserCourse = async (id: string, courseId: string, authToken: string) => await httpDelete(`/user/${id}/courses/${courseId}`, authToken);
export const deleteUser = async (userId: string, authToken: string) => await httpDelete(`/user/${userId}`, authToken);
export const createCourse = async (info: createCourseInfo, authToken: string) => await httpPost('/course', authToken, {"subject": info.subject, "number": info.number, "title": info.title, "user_id": info.user_id, "syllabus": info.syllabus});
export const setCourse = async (courseId: string, info: setCourseInfo, authToken: string) => await httpPatch(`/course/${courseId}`, authToken, info);
export const deleteCourse = async (courseId: string, authToken: string) => await httpDelete(`/course/${courseId}`, authToken);
export const userSearchCourses = async (id: string, query: courseQuery, authToken: string) => {
    const queryString = new URLSearchParams(query as Record<string, string>).toString();
  
    return await httpGet(`/user/${id}/courses/search?${queryString}`, authToken);
}
export const createUser = async (info: UserInfo, authToken: string) => await httpPost('/user', authToken, { "user_id": info._id, "name": info.name, "email": info.email });
export const askQuestion = async (info: QuestionInfo, authToken: string) => await httpPost('/chat', authToken, { "course_id": info.courseId, "question": info.question }); 

async function httpGet(url: string, authToken: string) {
    const requestInfo = { 
        method: "GET",
        signal: controller.signal, 
        headers: {
            "Authorization": "Bearer " + authToken
        }, 
    };
    
    return await fetch(FLASK_URL + url, requestInfo)
        .then(response => response.json());
}

async function httpPost(url: string, authToken: string, payload?: Object) {
    const requestInfo = { 
        method: "POST",
        signal: controller.signal, 
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

async function httpPatch(url: string, authToken: string, payload?: Object) {
    const requestInfo = { 
        method: "PATCH", 
        signal: controller.signal, 
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

async function httpDelete(url: string, authToken: string) {
    const requestInfo = { 
        method: "DELETE",
        signal: controller.signal, 
        headers: {
            "Authorization": "Bearer " + authToken
        }, 
    };
    
    return await fetch(FLASK_URL + url, requestInfo)
}
