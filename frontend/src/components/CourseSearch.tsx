import React, { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useTheme } from '@mui/material/styles';
import { CircularProgress, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { selectUserState } from '../features/user-info/userInfoSlice';
import { courseComparator, selectCourseState, updateCourseList } from '../features/course/courseSlice';
import { addUserCourse, userSearchCourses } from '../services/httpService';
import { CourseInfo, courseQuery, subjectToCode } from '../models/courseModels';
import SubjectDropdown from './SubjectDropdown';
import CourseInput from './CourseInput';
import './Sidebar.css';
import './CourseSearch.css';
import { selectChatbotState, updateCourse } from '../features/chatbot/chatbotSlice';

function CourseSearch() {    
    const theme = useTheme()
    
    const dispatch = useAppDispatch();
    
    const userState = useAppSelector(selectUserState);
    const courseState = useAppSelector(selectCourseState);
    const chatbotState = useAppSelector(selectChatbotState);

    const [courseProperties, setCourseProperties] = useState<courseQuery>({subject:"", number:"", title:""});
    const [found, setFound] = useState<{courses: CourseInfo[], status: "loading" | "success" | "failed" | ""}>({courses: [], status: ""});
    const [error, setError] = useState("");

    const coursePropertiesHandler = useCallback((key: "subject" | "number" | "title") => (value: string | null) => {
        setCourseProperties(prevState => ({...prevState, [key]: value || ""}));
    }, []);

    const search = useCallback(() => {
        if (Object.values(courseProperties).filter(Boolean).length < 2) {
            setFound({status: "", courses: found.courses});
            setError("Please refine your search");
            return;
        }
        else if (userState && userState.user) {
            setFound({status: "loading", courses: found.courses});
            let query: courseQuery = {};
            Object.entries(courseProperties).forEach(([key, value]) => {
                if (value) {
                    if (key === "subject")  {
                        query[key as keyof courseQuery] = subjectToCode[value as keyof typeof subjectToCode];
                    } else {
                        query[key as keyof courseQuery] = value;
                    }
                }
            });
            userSearchCourses(userState.user._id, query, userState.userCredential)
                .then(fetchedCourses => {
                    if (userState.user)
                        return fetchedCourses.sort(courseComparator(userState.user._id));
                })
                .then(sortedCourses => {
                    setFound({status: "success", courses: sortedCourses});
                })
                .catch(err => {
                    console.error("Error fetching courses:", err);
                    setFound({status: "failed", courses: found.courses});
                });
        }
    }, [courseProperties, userState]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            search();
        }
    }, [search]);
    
    return (
        <div className="tab-content" onKeyDown={handleKeyPress}>
            <Grid container className="search-components">
                <Grid item xs={7} padding={"0px 8px 8px 0px"}>
                    <SubjectDropdown handleSubject={coursePropertiesHandler("subject")} size="small"/>
                </Grid>
                <Grid item xs={5}>
                    <CourseInput handleInput={coursePropertiesHandler("number")} size="small" label="Number"/>
                </Grid>
                <Grid item xs style={{display:"flex"}}>
                    <CourseInput handleInput={coursePropertiesHandler("title")} size="small" label="Name"/>
                    <IconButton size="medium" onClick={search} disabled={found.status === "loading"} className="search-button" style={{color: "#e5e5e5", backgroundColor: found.status === "loading" ? theme.palette.primary.dark : theme.palette.primary.main}}><SearchIcon /></IconButton>         
                </Grid>
            </Grid>
            {found.status === "loading" 
                ? <div className="progress"><CircularProgress color="primary"/></div>
                : found.status === "success" 
                    ? found.courses.length 
                        ? <List disablePadding sx={{overflowY: "auto"}}> {
                            found.courses.map(course => (
                                <ListItem key={course.name} sx={{padding: "4px 0px"}}>
                                    <ListItemButton 
                                        disableRipple 
                                        className="course"
                                        sx={{ cursor: "default", backgroundColor: theme.palette.background.paper, '&.MuiListItemButton-root:hover':{bgcolor: 'transparent'} }}
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
                                                    textOverflow: "ellipsis"
                                                }
                                            }}
                                            secondary={"By " + course.instructor.name}
                                        />
                                        <IconButton disableTouchRipple onClick={() => {
                                                setFound({status: found.status, courses: found.courses.filter(foundCourse => foundCourse._id !== course._id)});
                                                if (!chatbotState.course)  {
                                                    dispatch(updateCourse(course));
                                                }
                                                if (userState.user) {
                                                    dispatch(updateCourseList({courses: courseState.courseList.concat(course), userId: userState.user?._id}));
                                                    addUserCourse(userState.user._id, {course_id: course._id}, userState.userCredential);
                                                }
                                            }
                                        }>
                                            <BookmarkBorderIcon />
                                        </IconButton>
                                    </ListItemButton>
                                </ListItem>
                            ))}</List>
                        : <Typography variant="body2" color={theme.palette.text.secondary} className="search-text"> Can't find your course? It may not be uploaded by the instructor yet. Try contacting them to request adding the course.</Typography>
                    : <Typography variant="body2" color={theme.palette.primary.dark} className="search-text">{error}</Typography>
            }
        </div>
    );    
}

export default CourseSearch;
