import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/user-info/userInfoSlice";
import { CourseInfo } from "../models/courseModels";
import { deleteCourse } from "../services/httpService";
import "./EditDialog.css";
import { Dialog, DialogContent, DialogTitle, Grid, Button, Divider, LinearProgress } from '@mui/material';
interface dialogProperties {
    open: boolean;
    course: CourseInfo;
    handleClose: () => void;
    remove: (courseId: string) => void;
}

function DeleteDialog({ open, course, handleClose, remove }: dialogProperties) {
    const userState = useAppSelector(selectUserState);
    const [isDeleting, setIsDeleting] = useState(false);

    const escape = () => {
        if (!isDeleting) {
            handleClose();
        }
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
                                setIsDeleting(true);
                                deleteCourse(course._id, userState.userCredential)
                                .then(() => {
                                    remove(course._id);
                                })
                                .finally(() => {
                                    setIsDeleting(false);
                                    handleClose();
                                });
                            }}
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
