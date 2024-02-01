import { CourseInfo } from "../models/courseModels";
import { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { removeUserCourse } from "../services/httpService";
import "./Sidebar.css"
import "./SavedCourses.css";
import { Typography, List, ListItem, ListItemButton, ListItemText, IconButton, CircularProgress, Menu, MenuItem } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import Create from '@mui/icons-material/Create'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";

interface savedCoursedProperties {
    coursesStatus: "loading" | "failed" | "success" | "";
    userCourses: CourseInfo[];
    setUserCourses: React.Dispatch<React.SetStateAction<CourseInfo[]>>;
    selectedCourse: CourseInfo | undefined;
    setSelectedCourse: React.Dispatch<React.SetStateAction<CourseInfo | undefined>>;
}

function SavedCourses({coursesStatus, userCourses, setUserCourses, selectedCourse, setSelectedCourse}: savedCoursedProperties) {
    const theme = useTheme()
    const user = useAppSelector(selectUserState);
    const [editDialogOpen, setEditDialog] = useState(false);
    const [editDialogCourse, setEditCourse] = useState<CourseInfo>();
    const [delDialogOpen, setDelDialog] = useState(false);
    const [delDialogCourse, setDelCourse] = useState<CourseInfo>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    const edit = (course: CourseInfo) => {
        setEditCourse(course);
        handleEditDialog(true);
    };
    const del = (course: CourseInfo) => {
        setDelCourse(course);
        handleDelDialog(true);
    };
    const remove = (courseId: string) => {
        if (user && user.user) {
            setUserCourses(userCourses.filter(course => course._id !== courseId));
            removeUserCourse(user.user._id, courseId, user.userCredential);
        }
    };
    const handleEditDialog = (open: boolean) => {
        setEditDialog(open);
    };
    const handleDelDialog = (open: boolean) => {
        setDelDialog(open);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, course: CourseInfo) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (userCourses.length > 0 && !selectedCourse) {
            setSelectedCourse(userCourses[0]);
        }
    }, [userCourses, setSelectedCourse]);

    return (
        <List disablePadding className="tab-content">
            {coursesStatus != "success" ?  
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height:"100%"}}>
                    <CircularProgress color="primary" />
                </div> : 
                (userCourses.length ? 
                    userCourses
                        .sort((a, b) => {
                            if ((a.instructor._id === user.user?._id) === (b.instructor._id === user.user?._id)) {
                                if (a.subject === b.subject)    {
                                    if (a.number === b.number)  {
                                        return a.instructor.name.localeCompare(b.instructor.name);
                                    }
                                    return a.number.localeCompare(b.number);
                                }
                                return a.subject.localeCompare(b.subject);
                            }
                            return a.instructor._id === user.user?._id ? -1 : 1;
                        })
                        .map(course => (
                            <ListItem key={course.name} disablePadding>
                                <ListItemButton 
                                    disableTouchRipple 
                                    onClick={() => {
                                        setSelectedCourse(course);
                                    }}
                                    className={`course${(selectedCourse && selectedCourse.name === course.name && selectedCourse.instructor._id === course.instructor._id)
                                        ? "-selected"
                                        : ""}`}
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
                                    {user.user && (user.user._id !== course.instructor._id || user.user.permission === "admin") && 
                                        <IconButton disableTouchRipple onClick={(event) => {
                                            event.stopPropagation();
                                            remove(course._id);
                                            }
                                        }>
                                            <BookmarkIcon color="primary"></BookmarkIcon>
                                        </IconButton>
                                    }
                                    {user.user && (user.user._id === course.instructor._id || user.user.permission === "admin") &&
                                        <>
                                            <IconButton onClick={(e) => handleMenuClick(e, course)}>
                                                <MoreHorizIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl) && selectedCourse === course}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem onClick={() => { edit(course); handleMenuClose(); }}>
                                                    <Create></Create> 
                                                    <Typography paddingLeft={"10px"}>
                                                        Edit
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem onClick={() => { del(course); handleMenuClose(); }}>
                                                    <DeleteOutlineIcon color="primary"></DeleteOutlineIcon>
                                                    <Typography color="primary" paddingLeft={"10px"}>
                                                        Delete
                                                    </Typography>
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
            </div>)
            }
            {editDialogCourse && editDialogOpen && <EditDialog currentCourse={editDialogCourse} setCurrentCourse={setEditCourse} open={editDialogOpen} handleDialog={handleEditDialog} userCourses={userCourses} setUserCourses={setUserCourses}/>}
            {delDialogCourse && delDialogOpen && <DeleteDialog currentCourse={delDialogCourse} open={delDialogOpen} handleDialog={handleDelDialog} remove={remove}/>}
        </List>
    );
}

export default SavedCourses;