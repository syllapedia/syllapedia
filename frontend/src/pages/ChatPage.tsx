import React from "react";
import "./ChatPage.css";
import { useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";

function ChatPage() {
    const user = useAppSelector(selectUserState);

    return (
        <h1>User: { user.user && user.status === 'idle' ? user.user.name : user.status }</h1>
    );
}

export default ChatPage;