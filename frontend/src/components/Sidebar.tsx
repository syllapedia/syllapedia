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
    const [createDialogOpen, createSetDialog] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [selectedTab, setSelectedTab] = useState("saved");
    const [selectedCourse, setSelectedCourse] = useState({name:"", instructor:""});

    useEffect(() => {
        if (user.user && user.user.courses && user.status === 'idle') {
            const rootStyle = document.documentElement.style;
            if (user.user.permission === "admin" || user.user.permission === "instructor") {
                rootStyle.setProperty("--num-tabs", "4");
            }
            getUserCourses(user.user._id)
                .then(fetchedCourses => {
                    setUserCourses(fetchedCourses);
                })
                .catch(error => {
                    console.error('Error fetching courses:', error);
                });
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
            <CreateDialog open={createDialogOpen} handleDialog={handleCreateDialog} />

            <Drawer
                className={`drawer-${drawerOpen ? 'open' : 'closed'}`}
                variant="permanent"
                anchor="left"
                open={drawerOpen}
            >
                <List className={`drawer-${drawerOpen ? 'open' : 'closed'}`} disablePadding>
                    <MenuTab open={drawerOpen} handleDrawerToggle={handleDrawerToggle}/>

                    <Divider />

                    <SavedTab open={drawerOpen} handleSavedClick={handleSavedClick}/>
                    {user.user && user.user._id && drawerOpen && 
                        <Collapse in={selectedTab === "saved"} timeout={400}> 
                            <SavedCourses userId={user.user._id} userCourses={userCourses} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>
                        </Collapse>
                    }
                    
                    <FindTab open={drawerOpen} handleFindClick={handleFindClick}/>
                    {drawerOpen && 
                        <Collapse in={selectedTab === "find"} timeout={400}>
                            <CourseSearch />
                        </Collapse>
                    }

                    {user.user && (user.user.permission === "instructor" || user.user.permission === "admin") && 
                        <>
                            <CreateTab open={drawerOpen} handleCreateDialog={handleCreateDialog} />
                        </>
                    }
                </List>
            </Drawer>
        </div>
    );
}

export default Sidebar;
