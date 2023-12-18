import React from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from './components/MainLayout';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';

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
        path: "*",
        element: <Navigate to="/" />
      }
    ]
  },
  {
    path: "/error",
    element: <h1>ERROR: INVALID PATH</h1>
  }
]);

export default Router;