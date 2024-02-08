import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { CourseInfo, setCourseInfo } from "../models/courseModels";
import { setCourse } from "../services/httpService";
import { subjectToCode, codeToSubject } from "../models/courseModels";
import "./EditDialog.css";
import { Dialog, DialogContent, DialogTitle, Grid, Button, Divider, LinearProgress, Typography } from '@mui/material';
import CourseNameView from "./CourseNameView";
import SubjectDropdown from "./SubjectDropdown";
import CourseInput from "./CourseInput";
import UploadSyllabus from "./UploadSyllabus";
import { selectCourseState, updateCourseList } from "../features/course/courseSlice";
import { updateCourse } from "../features/chatbot/chatbotSlice";

interface dialogProperties {
    open: boolean;
    course: CourseInfo;
    handleClose: () => void;
}

function EditDialog({ open, course, handleClose }: dialogProperties) {
    const dispatch = useAppDispatch();

    const userState = useAppSelector(selectUserState);
    const courseState = useAppSelector(selectCourseState);

    const [isEditing, setIsEditing] = useState(false);
    const [courseProperties, setCourseProperties] = useState({subject:course.subject, number:course.number, title:course.title});
    const [syllabus, setSyllabus] = useState(course.syllabus.pdf);
    const [error, setError] = useState("");

    const coursePropertiesHandler = (key: "subject" | "number" | "title") => {
        return (value: string | null) => {
            if (key === "subject")  {
                setCourseProperties(prevState => ({...prevState, [key]: value ? subjectToCode[value as keyof typeof subjectToCode] : ""}));
            } else {
                setCourseProperties(prevState => ({...prevState, [key]: value ? value : ""}));
            }
        };
    };
    const resetCourseProperties = () => setCourseProperties({subject:course.subject, number:course.number, title:course.title});
	const handleSyllabus = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(",")[1];
                setSyllabus(base64String);
            };
            reader.readAsDataURL(file);
        } else {
            setSyllabus("");
        }
    };
    const escape = () => {
        if (!isEditing) {
            handleClose();
            resetCourseProperties();
            setSyllabus("");
            setError("");
        }
    };
    const editCourse = () => {
        if (courseProperties.subject === "") {
            setError("Please select the course subject");
        } else if (courseProperties.number === "") {
            setError("Please enter the course number");
        } else if (courseProperties.title === "") {
            setError("Please enter the course title");
        } else if (syllabus === "") {
            setError("Please upload the course syllabus");
        } else {
            let changes: setCourseInfo = {};
            if (courseProperties.subject !== course.subject) {
                changes.subject = courseProperties.subject;
            }
            if (courseProperties.number !== course.number) {
                changes.number = courseProperties.number;
            }
            if (courseProperties.title !== course.title) {
                changes.title = courseProperties.title;
            }
            if (syllabus !== course.syllabus.pdf) {
                changes.syllabus = syllabus;
            }
            if (Object.keys(changes).length === 0) {
                setError("Please make a change to edit the course");
            } else if (userState.user) {
                setIsEditing(true);
                setCourse(course._id, changes, userState.userCredential)
                    .then(response => {
                        if (typeof response === "string") {
                            setError(response);
                        } else {
                            if (userState.user) {
                                dispatch(updateCourseList({courses: courseState.courseList.map((course: CourseInfo) => response._id === course._id ? response : course), userId: userState.user._id}));
                            }
                            dispatch(updateCourse(response));
                            escape();
                        }
                        setIsEditing(false);
                    })
            }
        }
    };
    

    return (
        <Dialog open={open} onClose={escape}>
            <DialogTitle>Edit Course</DialogTitle>
            {isEditing ? <LinearProgress style={{marginTop: "-3px"}}/> : <Divider></Divider>}
            <DialogContent style={{width:"380px"}}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <CourseNameView courseProperties={courseProperties}/>
                    </Grid>
                    <Grid item xs={6}>
                        <SubjectDropdown handleSubject={coursePropertiesHandler("subject")} size="medium" defaultValue={codeToSubject[courseProperties.subject as keyof typeof codeToSubject]}/>
                    </Grid>
                    <Grid item xs={6}>
                        <CourseInput handleInput={coursePropertiesHandler("number")} size="medium" label="Number" defaultValue={courseProperties.number}/>
                    </Grid>
                    <Grid item xs={12}>
                        <CourseInput handleInput={coursePropertiesHandler("title")} size="medium" label="Name" defaultValue={courseProperties.title}/>
                    </Grid>
                    <Grid item xs={12}>
                        <UploadSyllabus syllabus={syllabus} handleSyllabus={handleSyllabus} size="medium" disabled={isEditing}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className="error-text" color={"error"}>
                            {error}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3}>
                        <Button onClick={escape} size="medium" variant="outlined" color="inherit" disabled={isEditing}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button size="medium" variant="contained" color="primary" onClick={editCourse} disabled={isEditing} style={{width: "100%"}}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default EditDialog;
