import React from 'react';
import './MainLayout.css';
import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <Outlet />
    );
}

export default MainLayout;