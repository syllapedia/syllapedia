import React, { useState } from "react";
import "./LoginPage.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadUser, selectUserState, updateCredential } from "../features/user-info/userInfoSlice";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { JWTUserInfo } from "../models/userModels";
import { Navigate } from "react-router-dom";

function LoginPage() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUserState);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSuccess = (response: CredentialResponse) => {
        if (response.credential) {
            const data = jwtDecode(response.credential) as JWTUserInfo;

            switch(true) {
                case !data.hd || data.hd !== "umass.edu": 
                    setErrorMessage("Invalid Email");
                    break;

                case !data.name || !data.email: 
                    setErrorMessage("Authentication Error");
                    break;

                default: 
                    dispatch(loadUser({ info: data, credential: response.credential }));
                    dispatch(updateCredential(response.credential));
            }
        } else {
            setErrorMessage("Connection Error");
        }
    }

    const handleError = () => setErrorMessage("Connection Error");

    return (
        <div className="login-page">
            { !user.user ? "Login with your school email to continue...\n" : <Navigate to="/home" />}
            <div className="login-error-message">
                { user.status === 'failed' ? "Connection Error" : errorMessage }
            </div>
            <div className="login-button-container">
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} width={200}/>
            </div>
        </div>
    );
}

export default LoginPage;