import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { addUserCourse, userSearchCourses } from "../services/httpService";
import { useTheme } from '@mui/material/styles';
import "./Sidebar.css"
import "./CourseSearch.css";
import { IconButton, Grid, List, ListItem, ListItemText, ListItemButton, CircularProgress, Typography } from '@mui/material';
import SubjectDropdown from "./SubjectDropdown";
import CourseInput from "./CourseInput";
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { CourseInfo, subjectToCode } from "../models/courseModels";
import { courseQuery } from "../models/courseModels";
import { selectCourseState, updateCourseList } from "../features/course/courseSlice";

function CourseSearch() {    
    const theme = useTheme()
    
    const dispatch = useAppDispatch();
    
    const userState = useAppSelector(selectUserState);
    const courseState = useAppSelector(selectCourseState);

    const [courseProperties, setCourseProperties] = useState<courseQuery>({subject:"", number:"", title:""});
    const [foundCourses, setFoundCourses] = useState<CourseInfo[]>([]);
    const [coursesStatus, setCoursesStatus] = useState<"loading" | "success" | "failed" | "">("")
    const [error, setError] = useState("");

    const coursePropertiesHandler = useCallback((key: "subject" | "number" | "title") => (value: string | null) => {
        setCourseProperties(prevState => ({...prevState, [key]: value || ""}));
    }, []);

    const search = useCallback(() => {
        if (Object.values(courseProperties).filter(Boolean).length < 2) {
            setCoursesStatus("");
            setError("Please refine your search");
            return;
        }
        else if (userState && userState.user) {
            setCoursesStatus("loading");
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
                    setFoundCourses(fetchedCourses);
                    setCoursesStatus("success");
                })
                .catch(err => {
                    console.error("Error fetching courses:", err);
                    setCoursesStatus("failed");
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
            <Grid container spacing={1} className="search-components">
                <Grid item xs={7}>
                    <SubjectDropdown handleSubject={coursePropertiesHandler("subject")} size="small"/>
                </Grid>
                <Grid item xs={5}>
                    <CourseInput handleInput={coursePropertiesHandler("number")} size="small" label="Number"/>
                </Grid>
                <Grid item xs style={{display:"flex"}}>
                    <CourseInput handleInput={coursePropertiesHandler("title")} size="small" label="Name"/>
                    <IconButton size="medium" onClick={search} disabled={coursesStatus === "loading"} className="search-button" style={{color: "#e5e5e5", backgroundColor: coursesStatus === "loading" ? theme.palette.primary.dark : theme.palette.primary.main}}><SearchIcon /></IconButton>         
                </Grid>
            </Grid>
            {coursesStatus === "loading" 
                ? <div className="progress"><CircularProgress color="primary"/></div>
                : coursesStatus === "success" 
                    ? foundCourses.length 
                        ? <List disablePadding> {
                            foundCourses.map(course => (
                                <ListItem key={course.name} disablePadding>
                                    <ListItemButton 
                                        disableRipple 
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
                                                    textOverflow: "ellipsis"
                                                }
                                            }}
                                            secondary={"By " + course.instructor.name}
                                        />
                                        <IconButton disableTouchRipple onClick={() => {
                                                setFoundCourses(foundCourses.filter(foundCourse => foundCourse._id !== course._id));
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
