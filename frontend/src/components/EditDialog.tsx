import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { CourseInfo, setCourseInfo } from "../models/courseModels";
import { setCourse } from "../services/httpService";
import { subjectToCode, codeToSubject } from "../models/courseModels";
import "./EditDialog.css";
import { Dialog, DialogContent, DialogTitle, Grid, Button, Divider, LinearProgress } from '@mui/material';
import CourseNameView from "./CourseNameView";
import SubjectDropdown from "./SubjectDropdown";
import CourseInput from "./CourseInput";
import UploadSyllabus from "./UploadSyllabus";
import ErrorText from "./ErrorText";

interface dialogProperties {
    currentCourse: CourseInfo;
    setCurrentCourse: React.Dispatch<React.SetStateAction<CourseInfo | undefined>>;
    open: boolean;
    handleDialog: (open: boolean) => void;
    userCourses: CourseInfo[];
    setUserCourses: React.Dispatch<React.SetStateAction<CourseInfo[]>>;
}

function EditDialog({ currentCourse, setCurrentCourse, open, handleDialog, userCourses, setUserCourses }: dialogProperties) {
    const user = useAppSelector(selectUserState);
    const [isEditing, setIsEditing] = useState(false);
    const [courseProperties, setCourseProperties] = useState({subject:currentCourse.subject, number:currentCourse.number, title:currentCourse.title});
    const [syllabus, setSyllabus] = useState(currentCourse.syllabus.pdf);
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
    const resetCourseProperties = () => {setCourseProperties({subject:currentCourse.subject, number:currentCourse.number, title:currentCourse.title});}
	const handleSyllabus = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setSyllabus(base64String);
            };
            reader.readAsDataURL(file);
        } else {
            setSyllabus("");
        }
    };
    const escape = () => {
        if (!isEditing) {
            handleDialog(false);
            setCurrentCourse(undefined);
            resetCourseProperties();
            setSyllabus("");
            setError("");
        }
    };
    const edit = () => {
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
            if (courseProperties.subject !== currentCourse.subject) {
                changes.subject = courseProperties.subject;
            }
            if (courseProperties.number !== currentCourse.number) {
                changes.number = courseProperties.number;
            }
            if (courseProperties.title !== currentCourse.title) {
                changes.title = courseProperties.title;
            }
            if (syllabus !== currentCourse.syllabus.pdf) {
                changes.syllabus = syllabus;
            }
            if (Object.keys(changes).length === 0) {
                setError("Please make a change to edit the course");
            } else if (user.user) {
                setIsEditing(true);
                setCourse(currentCourse._id, changes, user.userCredential)
                    .then(response => {
                        if (typeof response === "string") {
                            setError(response);
                        } else {
                            setUserCourses(userCourses.map((course: CourseInfo) => response._id === course._id ? response : course));
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
                        <UploadSyllabus syllabus={syllabus} handleSyllabus={handleSyllabus} size="medium"/>
                    </Grid>
                    <Grid item xs={12}>
                        <ErrorText error={error}/>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3}>
                        <Button onClick={escape} size="medium" variant="outlined" color="inherit">
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button size="medium" variant="contained" color="primary" onClick={edit} style={{width: "100%"}}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default EditDialog;
