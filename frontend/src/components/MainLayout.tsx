import './MainLayout.css';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUserState } from '../features/user-info/userInfoSlice';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function MainLayout() {
    const user = useAppSelector(selectUserState);
    const location = useLocation();

    const PageLayout = () => (
        ["/login", "/settings"].reduce((acc, e) => acc && (location.pathname != e), true)  ?
                <div className="outer-layout-container">
                    <Sidebar />
                    <div className="inner-layout-container">
                        <Navbar title={"COMPSCI 240 - Reasoning Under Uncertainty"}/>
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