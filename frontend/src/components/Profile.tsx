import { useContext, useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { useAppSelector } from "../app/hooks";
import { selectUserState, updateCredential, updateInfo } from "../features/user-info/userInfoSlice";
import { ColorModeContext } from '../App';
import "./Profile.css";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Avatar, Menu, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';


function Profile() {
    const user = useAppSelector(selectUserState);
    const isMobile = useMediaQuery('(max-width: 520px)');
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
                        { isMobile
                            ? <KeyboardArrowDownIcon className="arrow"/>
                            : <><Typography color={theme.palette.text.primary} className="profile-text">{user.user.name}</Typography>
                            <Typography color={theme.palette.text.secondary} className="profile-text">{user.user.email}</Typography></>
                        }
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
                                <LogoutIcon color="primary"></LogoutIcon>
                                <Typography color="primary" className="menu-text">Log Out</Typography>
                            </MenuItem>
                            
                            { /*user.user.permission !== "admin" &&
                                <MenuItem className="menu-item">
                                    <DeleteIcon color={"primary"}></DeleteIcon>
                                    <Typography variant={"body1"} color={"primary"} className="menu-text">Delete Account</Typography>
                                </MenuItem>
                            */ }
                        </Menu>
                    </div>
                </>
            }
        </div>
    );
}

export default Profile;