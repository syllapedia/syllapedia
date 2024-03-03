import React from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from './components/MainLayout';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage'

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />
      },
      {
        path: "/chat",
        element: <ChatPage />
      },
      {
        path: "/settings",
        element: <SettingsPage />
      },
      {
        path: "/analytics",
        element: <AnalyticsPage />
      },
      {
        path: "*",
        element: <Navigate to="/" />
      }
    ]
  }
]);

export default Router;