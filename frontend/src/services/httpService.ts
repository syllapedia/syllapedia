import { UserInfo } from "../models/userModels";

const FLASK_URL = 'https://syllapedia.azurewebsites.net';
// const FLASK_URL = 'http://localhost:5000'

export const getStatus = async () => await get('/');

export const getUser = async (id: string) => await get(`/user/${id}`);
export const createUser = async (info: UserInfo) => await post('/user', { "user_id": info._id, "name": info.name, "email": info.email }, false);

async function get(url: string) {
    const requestInfo = { method: "GET" };
    
    return await fetch(FLASK_URL + url, requestInfo)
        .then(response => response.json())
}

async function post(url: string, payload?: Object, hasResponseBody=true) {
    const requestInfo = { 
        method: "POST", 
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: payload ? JSON.stringify(payload) : null
    };

    return await fetch(FLASK_URL + url, requestInfo)
        .then(response => hasResponseBody ? response.json() : response)
}

async function patch(url: string, payload?: Object) {
    const requestInfo = { 
        method: "PATCH", 
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: payload ? JSON.stringify(payload) : null
    };

    return await fetch(FLASK_URL + url, requestInfo)
        .then(response => response.json())
}