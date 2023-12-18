import React from "react";
import "./LoginPage.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadUser, selectUserState } from "../features/user-info/userInfoSlice";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { JWTUserInfo } from "../models/userModels";

function LoginPage() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUserState);
    const handleSuccess = (response: CredentialResponse) => {
        if (response.credential) {
            const data = jwtDecode(response.credential) as JWTUserInfo;

            // TODO: Create error message on UI instead of throwing an error
            if (!data.name || !data.email) throw new Error("Invalid Token")
            
            dispatch(loadUser(data));
        } else {
            // TODO: Create error message on UI instead of throwing an error
            throw new Error("Unable to get access token");
        }
    }

    return (
        <>
            <h1>{ !user.user ? "Login with your school email" : "Welcome " + user.user!.name }</h1>
            <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login Error")} width={200}/>
        </>
    );
}

export default LoginPage;