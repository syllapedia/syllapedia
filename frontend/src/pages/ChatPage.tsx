import React from "react";
import "./ChatPage.css";
import { useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import Sidebar from '../components/Sidebar';
import Navbar from "../components/Navbar";

function ChatPage() {
    const user = useAppSelector(selectUserState);

    return (
        <div className="root">
            <Sidebar />
            <div className="page">
                <h1>User: {user.user && user.status === 'idle' ? user.user.name : user.status}</h1>
            </div>
        </div> 
    );
}

export default ChatPage;