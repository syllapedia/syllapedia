import React, { useState } from "react";
import "./SettingsPage.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadUser, selectUserState, updateCredential } from "../features/user-info/userInfoSlice";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function SettingsPage() {
    const user = useAppSelector(selectUserState);

    return (
        <div className="settings-page">
            <Navbar />
        </div>
    );
}

export default SettingsPage;