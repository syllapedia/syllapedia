import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { selectCourseState, updateCourseList } from "../features/course/courseSlice";
import { selectChatbotState, updateCourse } from "../features/chatbot/chatbotSlice";
import { CourseInfo, setCourseInfo } from "../models/courseModels";
import { deleteCourse, removeUserCourse, setCourse } from "../services/httpService";
import "./Sidebar.css";
import "./SavedCourses.css";
import { Typography, List, ListItem, ListItemButton, ListItemText, IconButton, CircularProgress, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Create from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import CourseDialog from "./CourseDialog";

enum Action { EDIT='edit', DELETE='delete' };
type DialogState = { [action in Action]: { isOpen: boolean, course: CourseInfo | null } };

function SavedCourses() {
    const theme = useTheme();

    const dispatch = useAppDispatch();

    const userState = useAppSelector(selectUserState);
    const chatbotState = useAppSelector(selectChatbotState);
    const courseState = useAppSelector(selectCourseState);

    const [dialogState, setDialogState] = useState<DialogState>({ 
        [Action.EDIT]: { isOpen: false, course: null },
        [Action.DELETE]: { isOpen: false, course: null}
    });

    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

    const handleDialog = (action: Action) => {
        return {
            open: (course: CourseInfo) => {
                let newDialogState = {...dialogState};

                newDialogState[action].course = course; 
                newDialogState[action].isOpen = true;

                setDialogState(newDialogState); 
            },
            close: () => { 
                let newDialogState = {...dialogState};

                newDialogState[action].course = null; 
                newDialogState[action].isOpen = false; 

                setDialogState(newDialogState);
            }
        }
    }

    const editCourse = (courseId: string, userCredential: string) => (changes: setCourseInfo) => {
        return setCourse(courseId, changes, userCredential)
            .then(response => {
                if (userState.user) {
                    dispatch(updateCourseList({courses: courseState.courseList.map((course: CourseInfo) => response._id === course._id ? response : course), userId: userState.user._id}));
                }
                dispatch(updateCourse(response));
            });
    }

    const removeCourse = (courseId: string) => {
        const newCourses = courseState.courseList.filter(course => course._id !== courseId);
        if (userState.user) {
            dispatch(updateCourseList({courses: newCourses, userId: userState.user._id}));
        }
        if (chatbotState.course && courseId === chatbotState.course._id)  {
            if (newCourses.length > 0)    {
                dispatch(updateCourse(newCourses[0]));
            } else {
                dispatch(updateCourse(null));
            }
        }
        return removeUserCourse(userState.user!._id, courseId, userState.userCredential);
    }

    const delCourse = (courseId: string) => () => {
        return Promise.allSettled([removeCourse(courseId), deleteCourse(courseId, userState.userCredential)]);
    };

    const editErrorHandler = (course: CourseInfo) => (courseProperties: setCourseInfo) => {
        if (courseProperties.subject === "") {
            return "Please select the course subject";
        } else if (courseProperties.number === "") {
            return "Please enter the course number";
        } else if (courseProperties.title === "") {
            return "Please enter the course name";
        } else if (!courseProperties.syllabus || courseProperties.syllabus.base64 === "") {
            return "Please upload the course syllabus";
        } else if (!courseProperties.syllabus || !["application/pdf", "text/html"].includes(courseProperties.syllabus.fileType))    {
            return "The syllabus must be a pdf or html document";
        } else {
            const changes: setCourseInfo = {};
            if (courseProperties.subject !== course.subject) {
                changes.subject = courseProperties.subject;
            }
            if (courseProperties.number !== course.number) {
                changes.number = courseProperties.number;
            }
            if (courseProperties.title !== course.title) {
                changes.title = courseProperties.title;
            }
            if (courseProperties.syllabus.base64 !== course.syllabus.pdf) {
                changes.syllabus = courseProperties.syllabus;
            }
            if (Object.keys(changes).length === 0) {
                return "Please make a change to edit the course";
            } else {
                return "";
            }
        }
    }

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorElement(event.currentTarget);
    const handleMenuClose = () => setAnchorElement(null);

    return (
        <List disablePadding sx={{ "&& .Mui-selected": { backgroundColor: theme.palette.background.default } }} className="tab-content">
            {courseState.status !== "idle" ?  
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height:"100%"}}>
                    <CircularProgress color="primary" />
                </div>     
            : 
                (courseState.courseList.length ? 
                    courseState.courseList.map(course => (
                        <ListItem key={course.name} sx={{padding: "4px 0px"}}>
                            <ListItemButton 
                                disableTouchRipple 
                                onClick={() => dispatch(updateCourse(course))}
                                selected={Boolean(chatbotState.course && chatbotState.course.name === course.name && chatbotState.course.instructor._id === course.instructor._id)}
                                className="course"
                            >
                                <ListItemText
                                    primary={
                                        <>
                                            <span>{course.subject + " " + course.number + " -"}</span>
                                            <br/>
                                            <span>
                                                {course.title}
                                            </span>

                                        </>
                                    }
                                    primaryTypographyProps={{ 
                                        style: {
                                            lineClamp: 2,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }
                                    }}
                                    secondary={"By " + course.instructor.name}
                                />
                                {userState.user && (userState.user._id !== course.instructor._id || userState.user.permission === "admin") && 
                                    <IconButton disableTouchRipple onClick={(event) => {
                                        event.stopPropagation();
                                        removeCourse(course._id);
                                        }
                                    }>
                                        <BookmarkIcon color="primary"></BookmarkIcon>
                                    </IconButton>
                                }
                                {userState.user && (userState.user._id === course.instructor._id || userState.user.permission === "admin") &&
                                    <>
                                        <IconButton onClick={(e) => handleMenuClick(e)}><MoreHorizIcon /></IconButton>
                                        <Menu
                                            anchorEl={anchorElement}
                                            open={Boolean(anchorElement) && chatbotState.course === course}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={() => { handleDialog(Action.EDIT).open(course); handleMenuClose(); }}>
                                                <Create></Create> 
                                                <Typography paddingLeft={"10px"}>Edit</Typography>
                                            </MenuItem>
                                            <MenuItem onClick={() => { handleDialog(Action.DELETE).open(course); handleMenuClose(); }}>
                                                <DeleteOutlineIcon color="primary"></DeleteOutlineIcon>
                                                <Typography color="primary" paddingLeft={"10px"}>Delete</Typography>
                                            </MenuItem>
                                        </Menu>
                                    </>
                                }
                            </ListItemButton>
                        </ListItem>
                    ))
                : 
                    <div style={{textAlign: "center", padding: "16px"}}>
                        <SearchIcon 
                            fontSize="medium" 
                            className="circle-icon" 
                            style={{
                                color: theme.palette.text.secondary, 
                                borderRadius: "100%", 
                                border: "2px solid",
                                padding: "8px",
                                borderColor: theme.palette.text.secondary
                            }}>
                        </SearchIcon>
                        <Typography color={theme.palette.text.secondary} variant="h5" style={{fontWeight: "bolder"}}>
                            Find Courses
                        </Typography>
                        <Typography color={theme.palette.text.secondary} variant="body2">
                            You haven't saved any courses yet! Browse courses and save your favorites here for easy access.
                        </Typography>
                    </div>
                )
            }
            { dialogState[Action.EDIT].isOpen && dialogState[Action.EDIT].course &&
                <CourseDialog 
                    open={dialogState[Action.EDIT].isOpen}
                    title={"Edit Course"}
                    actionTitle={"Save"}
                    course={dialogState[Action.EDIT].course}
                    courseOptions={true}
                    errorHandler={editErrorHandler(dialogState[Action.EDIT].course)}
                    actionHandler={editCourse(dialogState[Action.EDIT].course?._id as string, userState.userCredential)}
                    handleClose={handleDialog(Action.EDIT).close}
                />
            }

            { dialogState[Action.DELETE].isOpen && dialogState[Action.DELETE].course &&
                <CourseDialog 
                    open={dialogState[Action.DELETE].isOpen}
                    title={"Delete Course"}
                    actionTitle={"Delete"}
                    text={"Are you sure you want to delete this course? This action cannot be undone. Please confirm."}
                    course={dialogState[Action.DELETE].course}  
                    actionHandler={delCourse(dialogState[Action.DELETE].course?._id as string)}
                    handleClose={handleDialog(Action.DELETE).close}
                />
            }
        </List>
    );
}

export default SavedCourses;