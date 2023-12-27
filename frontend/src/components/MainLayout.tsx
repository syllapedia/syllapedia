import React from 'react';
import './MainLayout.css';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useAppSelector } from '../app/hooks';
import { selectUserState } from '../features/user-info/userInfoSlice';

function MainLayout() {
    const user = useAppSelector(selectUserState);
    const location = useLocation();

    return (
        <>
            <Navbar />
            {
                location.pathname !== "/login" && (user.user === null || user.status === 'failed') ?
                    <Navigate to="/login" />
                :
                    <Outlet />
            }
        </>
    );
}

export default MainLayout;