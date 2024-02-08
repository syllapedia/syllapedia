import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import "./Sidebar.css";
import { Divider, Drawer, List, Collapse } from '@mui/material';
import CourseSearch from "./CourseSearch";
import CreateDialog from "./CreateDialog";
import MenuTab from "./MenuTab";
import SavedTab from "./SavedTab";
import SavedCourses from "./SavedCourses";
import FindTab from "./FindTab";
import CreateTab from "./CreateTab";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { selectCourseState } from "../features/course/courseSlice";
import { selectChatbotState, updateCourse } from "../features/chatbot/chatbotSlice";

function Sidebar() {
    const user = useAppSelector(selectUserState);
    const chatbotState = useAppSelector(selectChatbotState);
    const courseState = useAppSelector(selectCourseState);

    const dispatch = useAppDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(window.innerWidth / window.innerHeight > 1);
    const [selectedTab, setSelectedTab] = useState("saved");

    useEffect(() => {
        const dark = document.documentElement.style;
        const light = document.querySelector(".light-theme") as HTMLElement;
        if (user!.user!.permission === "admin" || user!.user!.permission === "instructor") {
            dark.setProperty("--num-tabs", "4");
            if (light)
                light.style.setProperty("--num-tabs", "4");
        }
    }, []);

    const handleDialog = (open: boolean) => setDialogOpen(open);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
        setSelectedTab("saved");
    }

    const handleSavedClick = () => {
        setSelectedTab("saved");
        if (!chatbotState.course)  {
            dispatch(updateCourse(courseState.courseList[0]));
        }
        setDrawerOpen(true);
    };
    
    const handleFindClick = () => {
        setSelectedTab("find");
        setDrawerOpen(true);
    };

    return (
        <div className="drawer">
            <CreateDialog open={dialogOpen} handleDialog={handleDialog}/>

            <Drawer
                className={`drawer-${drawerOpen ? "open" : "closed"}`}
                variant="permanent"
                anchor="left"
                open={drawerOpen}
            >
                <List className={`drawer-${drawerOpen ? "open" : "closed"}`} disablePadding>
                    <MenuTab open={drawerOpen} handleDrawerToggle={handleDrawerToggle}/>

                    <Divider />

                    <SavedTab open={drawerOpen} handleSavedClick={handleSavedClick}/>
                    {user.user && user.user._id && drawerOpen && 
                        <Collapse in={selectedTab === "saved"} timeout={400}> 
                            <SavedCourses />
                        </Collapse>
                    }
                    
                    <FindTab open={drawerOpen} handleFindClick={handleFindClick}/>
                    {drawerOpen && 
                        <Collapse in={selectedTab === "find"} timeout={400}>
                            <CourseSearch />
                        </Collapse>
                    }

                    {user.user && (user.user.permission === "instructor" || user.user.permission === "admin") && 
                        <CreateTab open={drawerOpen} handleCreateDialog={handleDialog} />
                    }
                </List>
            </Drawer>
        </div>
    );
}

export default Sidebar;
