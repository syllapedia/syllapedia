import React from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from './components/MainLayout';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <ChatPage />
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/settings",
        element: <SettingsPage />
      },
      {
        path: "*",
        element: <Navigate to="/" />
      }
    ]
  }
]);

export default Router;