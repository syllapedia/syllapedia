import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { selectCourseState, updateCourseList } from "../features/course/courseSlice";
import { createCourse } from "../services/httpService";
import { setCourseInfo } from "../models/courseModels";
import "./Sidebar.css";
import { Divider, Drawer, List, Collapse } from '@mui/material';
import CourseSearch from "./CourseSearch";
import MenuTab from "./MenuTab";
import SavedTab from "./SavedTab";
import SavedCourses from "./SavedCourses";
import FindTab from "./FindTab";
import CourseDialog from "./CourseDialog";
import CreateTab from "./CreateTab";

function Sidebar() {
    const userState = useAppSelector(selectUserState);
    const courseState = useAppSelector(selectCourseState);

    const dispatch = useAppDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(window.innerWidth / window.innerHeight > 1);
    const [selectedTab, setSelectedTab] = useState("saved");

    useEffect(() => {
        const dark = document.documentElement.style;
        const light = document.querySelector(".light-theme") as HTMLElement;
        if (userState!.user!.permission === "admin" || userState!.user!.permission === "instructor") {
            dark.setProperty("--num-tabs", "4");
            if (light)
                light.style.setProperty("--num-tabs", "4");
        }
    }, []);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
        setSelectedTab("saved");
    }

    const handleTabClick = (type: "saved" | "find") => () => {
        setSelectedTab(type);
        setDrawerOpen(true);
    };

    const newCourse = (userId: string, userCredential: string) => (info: {subject:string, number:string, title:string, syllabus: {base64: string, fileType: string}}) => {
        return createCourse({user_id: userId, ...info}, userCredential)
            .then(response => {
                if (userState.user) {
                    dispatch(updateCourseList({courses: courseState.courseList.concat(response), userId: userState.user._id}));
                }
            });
    }

    const createErrorHandler = (courseProperties: setCourseInfo) => {
        if (courseProperties.subject === "")    {
            return "Please select the course subject";
        }
        else if (courseProperties.number === "")    {
            return "Please enter the course number";
        }
        else if (courseProperties.title === "")    {
            return "Please enter the course name";
        }
        else if (courseProperties.syllabus?.base64 === "")    {
            return "Please upload the course syllabus";
        }
        else if (!courseProperties.syllabus || !["application/pdf", "text/html"].includes(courseProperties.syllabus.fileType))    {
            return "The syllabus must be a pdf or html document";
        } else {
            return "";
        }
    }

    return (
        <div className="drawer">
            <CourseDialog 
                open={dialogOpen}
                title={"Create Course"}
                actionTitle={"Create"}
                courseOptions={true}
                errorHandler={createErrorHandler}
                actionHandler={newCourse(userState.user?._id as string, userState.userCredential)}
                handleClose={() => setDialogOpen(false)}
            />

            <Drawer
                className={`drawer-${drawerOpen ? "open" : "closed"}`}
                variant="permanent"
                anchor="left"
                open={drawerOpen}
            >
                <List className={`drawer-${drawerOpen ? "open" : "closed"}`} disablePadding>
                    <MenuTab open={drawerOpen} handleDrawerToggle={handleDrawerToggle}/>

                    <Divider />

                    <SavedTab open={drawerOpen} handleSavedClick={handleTabClick("saved")}/>
                    {userState.user && userState.user._id && drawerOpen && 
                        <Collapse in={selectedTab === "saved"} timeout={400}> 
                            <SavedCourses />
                        </Collapse>
                    }
                    
                    <FindTab open={drawerOpen} handleFindClick={handleTabClick("find")}/>
                    {drawerOpen && 
                        <Collapse in={selectedTab === "find"} timeout={400}>
                            <CourseSearch />
                        </Collapse>
                    }

                    {userState.user && (userState.user.permission === "instructor" || userState.user.permission === "admin") && 
                        <CreateTab open={drawerOpen} handleCreateClick={setDialogOpen}/>
                    }
                </List>
            </Drawer>
        </div>
    );
}

export default Sidebar;
