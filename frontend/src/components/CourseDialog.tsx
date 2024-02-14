import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, Grid, Button, Divider, LinearProgress, Typography, useMediaQuery } from '@mui/material';
import CourseNameView from './CourseNameView';
import SubjectDropdown from './SubjectDropdown';
import CourseInput from './CourseInput';
import UploadSyllabus from './UploadSyllabus';
import { CourseInfo, NewSyllabus, createCourseInfo, subjectToCode, codeToSubject } from '../models/courseModels';
import './CourseDialog.css';

interface dialogProperties {
    open: boolean;
    title: string;
    actionTitle: string;
    text?: string;
    course?: CourseInfo | null;
    courseOptions?: boolean
    errorHandler?: (c: any) => (string);
    actionHandler: (...args: any[]) => Promise<any>;
    handleClose?: () => void;
}

function CourseDialog({ open, title, actionTitle, text="", course=null, courseOptions=false, errorHandler=(c: createCourseInfo) =>  "", actionHandler=() => Promise.resolve(), handleClose=() => {} }: dialogProperties) {
    const [actionStarted, setActionStarted] = useState(false);
    const isMobile = useMediaQuery('(max-width: 520px)');

    let defaultCourseProperties = {subject:"", number:"", title:"", syllabus: {base64: "", fileType: ""}}
    let [courseProperties, setCourseProperties] = useState(defaultCourseProperties);
    let coursePropertiesHandler = (key: "subject" | "number" | "title" | "syllabus") => {
        if (key === "syllabus") {
            return (value: NewSyllabus) => {};
        } else {
            return (value: string | null) => {};
        }
    };
    let resetCourseProperties = () => {};
    let handleSyllabus = (file: File | null) => {};
    const [error, setError] = useState("");

    if (courseOptions) {
        defaultCourseProperties = course ? {subject:course.subject, number:course.number, title:course.title, syllabus:{base64: course.syllabus.pdf, fileType: "application/pdf"}} : {subject:"", number:"", title:"", syllabus: {base64: "", fileType: ""}};
        [courseProperties, setCourseProperties] = useState(defaultCourseProperties);
        coursePropertiesHandler = (key: "subject" | "number" | "title" | "syllabus") => {
            if (key === "syllabus") {
                return (value: NewSyllabus) => setCourseProperties(prevState => ({...prevState, [key]: value ? value : {base64: "", fileType: ""}}));
            } else {
                return (value: string | null) => {
                    if (key === "subject")  {
                        setCourseProperties(prevState => ({...prevState, [key]: value ? subjectToCode[value as keyof typeof subjectToCode] : ""}));
                    } else {
                        setCourseProperties(prevState => ({...prevState, [key]: value ? value : ""}));
                    }
                };
            }
        };
        resetCourseProperties = () => setCourseProperties(defaultCourseProperties);
        handleSyllabus = (file: File | null) => {
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(",")[1];
                    (coursePropertiesHandler("syllabus") as ((value: NewSyllabus) => void))({base64: base64String, fileType: file.type});
                };
                reader.onerror = (error) => {
                    console.error("Error reading file:", error);
                    (coursePropertiesHandler("syllabus") as ((value: NewSyllabus) => void))({base64: "", fileType: ""});                
                };
                reader.readAsDataURL(file);
            } else {
                (coursePropertiesHandler("syllabus") as ((value: NewSyllabus) => void))({base64: "", fileType: ""});
            }
        };
    }
    const escape = () => {
        if (!actionStarted) {
            handleClose();
            if (courseOptions) {
                resetCourseProperties();
            }
            setError("");
        }
    };
    const action = () => {
        if (courseOptions)  {
            if (errorHandler(courseProperties)) {
                setError(errorHandler(courseProperties));
            } else {
                setError("");
                setActionStarted(true);
                actionHandler(courseProperties).then(() => {setActionStarted(false);escape();});
            }
        } else {
            setError("");
            setActionStarted(true);
            actionHandler().then(() => {setActionStarted(false);handleClose();});
        }
    };

    return (
        <Dialog open={open} onClose={escape}>
            <DialogTitle>{title}</DialogTitle>
            {actionStarted ? <LinearProgress style={{marginTop: "-3px"}}/> : <Divider></Divider>}
            <DialogContent style={{display: "flex", alignSelf: "center", width:(isMobile ? "80%" : "380px")}}>
                <Grid container spacing={1}>
                    {courseOptions && 
                        <>
                            <Grid item xs={12}>
                                <CourseNameView courseProperties={courseProperties} />
                            </Grid>
                            <Grid item xs={6}>
                                <SubjectDropdown handleSubject={coursePropertiesHandler("subject") as (value: string | null) => void} size={isMobile ? "small" : "medium"} defaultValue={courseProperties.subject ? codeToSubject[courseProperties.subject as keyof typeof codeToSubject] : undefined} />
                            </Grid><Grid item xs={6}>
                                <CourseInput handleInput={coursePropertiesHandler("number") as (value: string | null) => void} size={isMobile ? "small" : "medium"} label="Number" defaultValue={courseProperties.number ? courseProperties.number : undefined} />
                            </Grid><Grid item xs={12}>
                                <CourseInput handleInput={coursePropertiesHandler("title") as (value: string | null) => void} size={isMobile ? "small" : "medium"} label="Name" defaultValue={courseProperties.title ? courseProperties.title : undefined} />
                            </Grid><Grid item xs={12}>
                                <UploadSyllabus syllabus={courseProperties.syllabus} handleSyllabus={handleSyllabus} size={isMobile ? "small" : "medium"} disabled={actionStarted} />
                            </Grid>
                        </>
                    }
                    {text && <Grid item xs={12} className="text">{text}</Grid>}
                    {error 
                        ? <Grid item xs={12}>
                            <Typography className="error-text" color={"error"}>
                                {error}
                            </Typography>
                        </Grid>
                        : <Grid item xs={12} height={"16px"}></Grid>

                    } 
                    <Grid item xs={12} style={{display: "flex", justifyContent: "end"}}>
                        <Button onClick={escape} size={isMobile ? "small" : "medium"} variant="outlined" color="inherit" disabled={actionStarted}>
                            Cancel
                        </Button>
                        <Button size={isMobile ? "small" : "medium"} variant="contained" color="primary" onClick={action} disabled={actionStarted} style={{marginLeft: "8px"}}>
                            {actionTitle}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default CourseDialog;
