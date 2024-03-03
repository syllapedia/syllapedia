import "./AnalyticsPage.css";
import AppsIcon from '@mui/icons-material/Apps';
import BookIcon from '@mui/icons-material/Book';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import {  useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import Navbar from "../components/Navbar";
import { useTheme } from '@mui/material/styles';
import { Box, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from "@mui/material";
import { useState } from "react";
import CourseAnalytics from "../components/CourseAnalytics";
import DashboardAnalytics from "../components/DashboardAnalytics";
import QuestionAnalytics from "../components/QuestionAnalytics";

function AnalyticsPage() {
    const user = useAppSelector(selectUserState);
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 520px)');
    const [selected, setSelected] = useState("dashboard");

    const renderInfo = () => {
        switch (selected) {
            case "dashboard":
                return <DashboardAnalytics />;
            case "courses":
                return <CourseAnalytics />;
            case "questions":
                return <QuestionAnalytics />;
            default:
                return <DashboardAnalytics />;
        }
    };

    return (
        <div className="analytics-page">
            <div>
                <Navbar/>
            </div>
            <div className="analytics-content">
                <List className="sidebar" disablePadding>
                    <ListItem className="tab">
                        <ListItemButton onClick={() => setSelected("dashboard")} className="tab">
                            <AppsIcon style={{padding: "18px"}}/>
                            {!isMobile && <ListItemText primary="Dashboard"/>}
                        </ListItemButton>
                    </ListItem>
                    <ListItem className="tab">
                        <ListItemButton onClick={() => setSelected("courses")} className="tab">
                            <BookIcon style={{padding: "18px"}}/>
                            {!isMobile && <ListItemText primary="Courses"/>}
                        </ListItemButton>
                    </ListItem>
                    <ListItem className="tab">
                        <ListItemButton onClick={() => setSelected("questions")} className="tab">
                            <QuestionAnswerIcon style={{padding: "18px"}}/>
                            {!isMobile && <ListItemText primary="Questions"/>}
                        </ListItemButton>
                    </ListItem>
                </List>
                <Box sx={{width:"4px", backgroundColor:theme.palette.background.default}}/>
                {renderInfo()}
            </div>
        </div>
    );
}

export default AnalyticsPage;
