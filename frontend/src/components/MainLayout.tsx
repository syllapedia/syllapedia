import React from 'react';
import './MainLayout.css';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUserState } from '../features/user-info/userInfoSlice';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function MainLayout() {
    const user = useAppSelector(selectUserState);
    const location = useLocation();

    const PageLayout = () => (
        location.pathname !== "/login" ?
                <div className="outer-layout-container">
                    <Sidebar />
                    <div className="inner-layout-container">
                        <Navbar />
                        <Outlet />
                    </div>
                </div>
            :
                <Outlet />
    );

    return (
        <> 
            {
                location.pathname !== "/login" && (user.user === null || user.status === 'failed') ?
                    <Navigate to="/login" />
                :
                    <PageLayout />
            }
        </>
    );
}

export default MainLayout;