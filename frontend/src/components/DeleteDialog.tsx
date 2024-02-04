import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { CourseInfo } from "../models/courseModels";
import { deleteCourse } from "../services/httpService";
import "./EditDialog.css";
import { Dialog, DialogContent, DialogTitle, Grid, Button, Divider, LinearProgress } from '@mui/material';

interface dialogProperties {
    currentCourse: CourseInfo;
    open: boolean;
    handleDialog: (open: boolean) => void;
    remove: (courseId: string) => void;
}

function DeleteDialog({ currentCourse, open, handleDialog, remove }: dialogProperties) {
    const user = useAppSelector(selectUserState);
    const [isDeleting, setIsDeleting] = useState(false);

    const escape = () => {
        if (!isDeleting) {
            handleDialog(false);
        }
    };

    const del = (courseId: string) => {
        setIsDeleting(true);
        deleteCourse(courseId, user.userCredential)
        .then(() => {
            remove(currentCourse._id);
        })
        .finally(() => {
            setIsDeleting(false);
            handleDialog(false);
        });
    };

    return (
        <Dialog open={open} onClose={escape}>
            <DialogTitle>Delete Course</DialogTitle>
            {isDeleting ? <LinearProgress style={{marginTop: "-3px"}}/> : <Divider></Divider>}
            <DialogContent style={{ width: "380px" }}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        Are you sure you want to delete this course?
                        <br></br>
                        This action cannot be undone.
                        Please confirm your decision.
                    </Grid><Grid item xs={6}>
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={escape} size="medium" variant="outlined" color="inherit" disabled={isDeleting}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button size="medium" variant="contained" color="primary"
                            onClick={() => {
                                del(currentCourse._id);
                            } }
                            disabled={isDeleting}
                            style={{ width: "100%" }}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteDialog;
