import React, { useEffect } from "react";
import "./ChatPage.css";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectUserState, loadUser } from "../features/user-info/userInfoSlice";

function ChatPage() {
    const userState = useAppSelector(selectUserState)
    const dispatch = useAppDispatch()

    // useEffect(() => {
    //     const getUserOnInit = async () => dispatch(loadUser("2"));

    //     getUserOnInit();
    // }, []);

    return (
        <h1>User: { userState.user && userState.status === 'idle' ? userState.user.name : userState.status }</h1>
    );
}

export default ChatPage;