import { useDispatch } from 'react-redux';
import { useContext, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUserState, updateCredential, updateInfo } from "../features/user-info/userInfoSlice";
import "./Profile.css";
import { Typography, Avatar, Menu, MenuItem, FormControlLabel, IconButton, Switch, ClickAwayListener } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { ColorModeContext } from '../App';


function Profile() {
    const user = useAppSelector(selectUserState);
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(updateInfo(null));
        dispatch(updateCredential(""));
        googleLogout();
        navigate("/login");
    }
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openMenu, setMenu] = useState(false)
    const nameToInitials = (name: string) => {return name.split(" ").reduce((acc, e) => acc + e[0], "");};
    return (
        <div className="profile" onClick={(e) => {setAnchorEl(e.currentTarget);setMenu(!openMenu);}}>
            {user && user.user && 
                <>
                    <Avatar sx={{ color: "#e5e5e5", bgcolor: theme.palette.primary.main }} className="avatar">{nameToInitials(user.user.name)}</Avatar>
                    <div style={{display: "block"}}>
                        <Typography color={theme.palette.text.primary} className="profile-text">
                            {user.user.name}
                        </Typography>
                        <Typography color={theme.palette.text.secondary} className="profile-text">
                            {user.user.email}
                        </Typography>
                            <Menu open={openMenu} anchorEl={anchorEl} className="menu">
                                { user.user.permission === "admin" ? 
                                    <MenuItem className="menu-item" onClick={() => navigate("/settings")}>
                                        <SettingsIcon></SettingsIcon>
                                        <Typography className="menu-text">Settings</Typography>
                                    </MenuItem>
                                    :
                                    <MenuItem onClick={(e) => {e.stopPropagation();}} className="menu-item">
                                        <FormControlLabel control={<Switch defaultChecked={localStorage.getItem("themeMode") === "dark"} onChange={(e) => {toggleColorMode();e.stopPropagation();}} color="default"/>} label={localStorage.getItem("themeMode") === "dark" ? "Dark Mode" : "Light Mode"}/>
                                    </MenuItem>
                                }
                                <MenuItem className="menu-item" onClick={logout}>
                                    <LogoutIcon></LogoutIcon>
                                    <Typography className="menu-text">Log Out</Typography>
                                </MenuItem>
                                
                                { /*user.user.permission !== "admin" &&
                                    <MenuItem className="menu-item">
                                        <DeleteIcon color={"primary"}></DeleteIcon>
                                        <Typography variant={"body1"} color={"primary"} className="menu-text">Delete Account</Typography>
                                    </MenuItem>
                                */}
                            </Menu>
                    </div>
                </>
            }
        </div>
    );
}

export default Profile;