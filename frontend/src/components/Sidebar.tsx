import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { getUserCourses } from "../services/httpService";
import { CourseInfo } from "../models/courseModels";
import CourseSearch from "./CourseSearch";
import CreateDialog from "./CreateDialog";
import MenuTab from "./MenuTab";
import SavedTab from "./SavedTab";
import SavedCourses from "./SavedCourses";
import FindTab from "./FindTab";
import CreateTab from "./CreateTab";
import "./Sidebar.css";
import { Divider, Drawer, List, Collapse } from '@mui/material';

function Sidebar() {
    const user = useAppSelector(selectUserState);
    const [userCourses, setUserCourses] = useState<CourseInfo[]>([]);
    const [coursesStatus, setCoursesStatus] = useState<"loading" | "success" | "failed" | "">("")
    const [createDialogOpen, createSetDialog] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [selectedTab, setSelectedTab] = useState("saved");
    const [selectedCourse, setSelectedCourse] = useState<CourseInfo>();

    const updateUserCourses = () => {
        if (user.user) {
            setCoursesStatus("loading");
            getUserCourses(user.user._id, user.userCredential)
                .then(fetchedCourses => {
                    setUserCourses(fetchedCourses);
                    setCoursesStatus("success");
                })
                .catch(error => {
                    console.error("Error fetching courses:", error);
                    setCoursesStatus("failed");
                });
        }
    };

    useEffect(() => {
        if (user.user && user.status === "idle") {
            const rootStyle = document.documentElement.style;
            rootStyle.setProperty("--num-tabs", (user.user.permission === "admin" || user.user.permission === "instructor") ? "4" : "3");
            updateUserCourses();
        }
    }, [user.user]);

    const handleCreateDialog = (open: boolean) => {
        createSetDialog(open);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
        setSelectedTab("saved");
    }

    const handleDrawerOpen = () => setDrawerOpen(true);

    const handleSavedClick = () => {
        setSelectedTab("saved");
        handleDrawerOpen();
    };
    
    const handleFindClick = () => {
        setSelectedTab("find");
        handleDrawerOpen();
    };

    return (
        <div className="root">
            <CreateDialog open={createDialogOpen} handleDialog={handleCreateDialog} userCourses={userCourses} setUserCourses={setUserCourses}/>

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
                            <SavedCourses coursesStatus={coursesStatus} userCourses={userCourses} setUserCourses={setUserCourses} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>
                        </Collapse>
                    }
                    
                    <FindTab open={drawerOpen} handleFindClick={handleFindClick}/>
                    {drawerOpen && 
                        <Collapse in={selectedTab === "find"} timeout={400}>
                            <CourseSearch userCourses={userCourses} setUserCourses={setUserCourses}/>
                        </Collapse>
                    }

                    {user.user && (user.user.permission === "instructor" || user.user.permission === "admin") && 
                        <CreateTab open={drawerOpen} handleCreateDialog={handleCreateDialog} />
                    }
                </List>
            </Drawer>
        </div>
    );
}

export default Sidebar;
