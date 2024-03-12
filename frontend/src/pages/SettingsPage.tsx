import { useContext, useEffect, useState } from 'react';
import { ColorModeContext } from '../App';
import "./SettingsPage.css";
import {  useAppSelector } from "../app/hooks";
import { selectUserState, updateCredential, updateInfo } from "../features/user-info/userInfoSlice";
import Navbar from "../components/Navbar";
import { FormControlLabel, Switch, IconButton, Typography, Divider, Dialog, DialogTitle, LinearProgress, DialogContent, Grid, Button, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteUser } from '../services/httpService';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function SettingsPage() {
    const user = useAppSelector(selectUserState);
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 520px)');
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const { toggleColorMode } = useContext(ColorModeContext);
    const [deleteDialogOpen, setDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const del = (userId: string) => {
        setIsDeleting(true);
        deleteUser(userId, user.userCredential)
        .then(() => {
            dispatch(updateInfo(null));
            dispatch(updateCredential(""));
            googleLogout();
            navigate("/");
        });
    }

    return (
        <div className="settings-page">
            <Dialog open={deleteDialogOpen} onClose={() => !isDeleting && setDeleteDialog(false)}>
                <DialogTitle>Delete Account</DialogTitle>
                    {isDeleting ? <LinearProgress style={{marginTop: "-3px"}}/> : <Divider></Divider>}
                <DialogContent style={{width:(isMobile ? "80%" : "380px")}}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant={(isMobile ? "body2" : "body1")}>
                                Are you sure you want to delete your account?
                                All account information will be permanently deleted and this action cannot be undone.
                                Please confirm.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{display: "flex", justifyContent: "end"}}>
                            <Button onClick={() => !isDeleting && setDeleteDialog(false)} size={isMobile ? "small" : "medium"} variant="outlined" color="inherit" disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button size={isMobile ? "small" : "medium"} variant="contained" color="primary"
                                onClick={() => user.user && del(user.user._id)}
                                disabled={isDeleting}
                                style={{marginLeft: "8px"}}>
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Navbar title={"Settings"}/>
            <div className="settings-body">
                <FormControlLabel sx={{color: theme.palette.text.primary}} control={<Switch defaultChecked={localStorage.getItem("themeMode") ? localStorage.getItem("themeMode") === "dark" : true} onClick={toggleColorMode}/>} label="Dark Mode"/>

                <IconButton style={{borderRadius: "4px"}} onClick={() => setDeleteDialog(!deleteDialogOpen)}>
                    <DeleteIcon color={"primary"}></DeleteIcon>
                    <Typography variant={"body1"} color={"primary"}>
                        Delete Account
                    </Typography>
                </IconButton>                    
            </div>
        </div>
    );
}

export default SettingsPage;