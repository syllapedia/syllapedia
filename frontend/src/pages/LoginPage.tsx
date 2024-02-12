import { useEffect, useState } from "react";
import "./LoginPage.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadUser, selectUserState, updateCredential, updateInfo } from "../features/user-info/userInfoSlice";
import { CredentialResponse, GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { JWTUserInfo } from "../models/userModels";
import { Navigate, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function LoginPage() {
    const navigate = useNavigate(); 
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUserState);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user.userCredential) {
            const expiration = jwtDecode(user.userCredential).exp;
            if (expiration) {
                const logoutTimer = setTimeout(() => {
                    dispatch(updateInfo(null));
                    dispatch(updateCredential(""));
                    googleLogout();
                    navigate("/login");
                }, (expiration - Date.now() / 1000) * 1000);
    
                return () => clearTimeout(logoutTimer);
            }
        }
    }, [user.userCredential]);

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
            <div className="login-info">
                <div className="logo">
                    Syllapedia
                </div>
                <div className="logo-subtitle">
                    The syllabus scanning and course answering chatbot made for students and instructors
                </div>
            </div>
            <div className="login-container">
                { !user.user ? "Log in to your school email..." : <Navigate to="/" />}
                <div className="login-error-message">
                    { user.status === 'failed' ? "Connection Error" : errorMessage }
                </div>
                <div className="login-button-container">
                    { 
                        user.status !== 'loading' ?
                            <GoogleLogin onSuccess={handleSuccess} onError={handleError} width={200}/> 
                        :
                            <CircularProgress color="primary" />
                    }
                </div>
            </div>
        </div>
    );
}

export default LoginPage;