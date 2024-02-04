import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { createCourse } from "../services/httpService";
import { CourseInfo, subjectToCode } from "../models/courseModels";
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

    const user = useAppSelector(selectUserState);
    const course = useAppSelector(selectCourseState);

    const [isCreating, setIsCreating] = useState(false);
    const [courseProperties, setCourseProperties] = useState({subject:"", number:"", title:""});
    const [syllabus, setSyllabus] = useState("");
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
        if (!isCreating)    {
            handleDialog(false);
            resetCourseProperties();
            setSyllabus("");
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
        else if (syllabus === "")    {
            setError("Please upload the course syllabus");
        }
        else if (user.user) {
            setIsCreating(true);
            createCourse({
                subject: courseProperties.subject,
                number: courseProperties.number,
                title: courseProperties.title,
                syllabus: syllabus,
                user_id: user.user._id
            }, user.userCredential)
            .then(response => {
                if (typeof response === "string")   {
                    setError(response);
                } else {
                    dispatch(updateCourseList(course.courseList.concat(response)));
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
