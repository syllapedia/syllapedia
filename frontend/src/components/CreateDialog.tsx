import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { createCourse } from "../services/httpService";
import { NewSyllabus, subjectToCode } from "../models/courseModels";
import "./CreateDialog.css";
import { Dialog, DialogContent, DialogTitle, Grid, Button, Divider, LinearProgress, Typography } from '@mui/material';
import CourseNameView from "./CourseNameView";
import SubjectDropdown from "./SubjectDropdown";
import CourseInput from "./CourseInput";
import UploadSyllabus from "./UploadSyllabus";
import { selectCourseState, updateCourseList } from "../features/course/courseSlice";

interface dialogProperties {
    open: boolean;
    handleDialog: (open: boolean) => void;
}

function CreateDialog({ open, handleDialog }: dialogProperties) {
    const dispatch = useAppDispatch();

    const userState = useAppSelector(selectUserState);
    const courseState = useAppSelector(selectCourseState);

    const [isCreating, setIsCreating] = useState(false);
    const [courseProperties, setCourseProperties] = useState({subject:"", number:"", title:""});
    const [syllabus, setSyllabus] = useState<NewSyllabus>({base64: "", fileType: ""});
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
    const resetCourseProperties = () => {setCourseProperties({subject:"", number:"", title:""});}
	const handleSyllabus = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(",")[1];
                setSyllabus({base64: base64String, fileType: file.type});
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                setSyllabus({base64: "", fileType: ""});
            };
            reader.readAsDataURL(file);
        } else {
            setSyllabus({base64: "", fileType: ""});
        }
    };
    const escape = () => {
        if (!isCreating)    {
            handleDialog(false);
            resetCourseProperties();
            setSyllabus({base64: "", fileType: ""});
            setError("");
        }
    };
    const create = () => {
        if (courseProperties.subject === "")    {
            setError("Please select the course subject");
        }
        else if (courseProperties.number === "")    {
            setError("Please enter the course number");
        }
        else if (courseProperties.title === "")    {
            setError("Please enter the course title");
        }
        else if (syllabus.base64 === "")    {
            setError("Please upload the course syllabus");
        }
        else if (!["application/pdf", "text/html"].includes(syllabus.fileType))    {
            setError("The syllabus must be a pdf or html document");
        }
        else if (userState.user) {
            setError("");
            setIsCreating(true);
            createCourse({
                subject: courseProperties.subject,
                number: courseProperties.number,
                title: courseProperties.title,
                syllabus: syllabus,
                user_id: userState.user._id
            }, userState.userCredential)
            .then(response => {
                if (typeof response === "string")   {
                    setError(response);
                } else {
                    if (userState.user) {
                        dispatch(updateCourseList({courses: courseState.courseList.concat(response), userId: userState.user?._id}));
                    }
                    escape();
                }
                setIsCreating(false);
            })
        }
    };

    return (
        <Dialog open={open} onClose={escape}>
            <DialogTitle>Create Course</DialogTitle>
            {isCreating ? <LinearProgress style={{marginTop: "-3px"}}/> : <Divider></Divider>}
            <DialogContent style={{width:"380px"}}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <CourseNameView courseProperties={courseProperties}/>
                    </Grid>
                    <Grid item xs={6}>
                        <SubjectDropdown handleSubject={coursePropertiesHandler("subject")} size="medium"/>
                    </Grid>
                    <Grid item xs={6}>
                        <CourseInput handleInput={coursePropertiesHandler("number")} size="medium" label="Number"/>
                    </Grid>
                    <Grid item xs={12}>
                        <CourseInput handleInput={coursePropertiesHandler("title")} size="medium" label="Name"/>
                    </Grid>
                    <Grid item xs={12}>
                        <UploadSyllabus syllabus={syllabus} handleSyllabus={handleSyllabus} size="medium" disabled={isCreating}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className="error-text" color={"error"}>
                            {error}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => escape()} size="medium" variant="outlined" color="inherit" disabled={isCreating}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button size="medium" variant="contained" color="primary" onClick={create} disabled={isCreating}>
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default CreateDialog;
