import './MainLayout.css';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUserState } from '../features/user-info/userInfoSlice';
import { selectChatbotState } from '../features/chatbot/chatbotSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function MainLayout() {
    const userState = useAppSelector(selectUserState);
    const chatbotState = useAppSelector(selectChatbotState);
    const location = useLocation();

    const PageLayout = () => (
        ["/login", "/settings"].reduce((acc, e) => acc && (location.pathname != e), true)  ?
                <div className="outer-layout-container">
                    <Sidebar />
                    <div className="inner-layout-container">
                        <Navbar title={chatbotState.course ? chatbotState.course.name : "No course selected"}/>
                        <Outlet />
                    </div>
                </div>
            :
                <Outlet />
    );

    return (
        <> 
            {
                location.pathname !== "/login" && (userState.user === null || userState.status === 'failed') ?
                    <Navigate to="/login" />
                :
                    <PageLayout />
            }
        </>
    );
}

export default MainLayout;