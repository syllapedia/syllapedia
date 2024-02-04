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
import { loadCourses } from "../features/course/courseSlice";

function Sidebar() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(selectUserState);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [selectedTab, setSelectedTab] = useState("saved");

    useEffect(() => {
        const rootStyle = document.documentElement.style;
        if (user!.user!.permission === "admin" || user!.user!.permission === "instructor") {
            rootStyle.setProperty("--num-tabs", "4");
        }
    }, []);

    const handleDialog = (open: boolean) => setDialogOpen(open);

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
            <CreateDialog open={dialogOpen} handleDialog={handleDialog}/>

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
