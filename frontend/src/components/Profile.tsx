import { useDispatch } from 'react-redux';
import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUserState, updateCredential, updateInfo } from "../features/user-info/userInfoSlice";
import "./Profile.css";
import { Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";


function Profile() {
    const user = useAppSelector(selectUserState);
    const theme = useTheme();
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
    const handleMenuClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {setAnchorEl(e.currentTarget);setMenu(!openMenu);};
    const nameToInitials = (name: string) => {return name.split(" ").reduce((acc, e) => acc + e[0], "");};
    return (
        <div onClick={e => handleMenuClick(e)} className="profile">
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
                            <MenuItem className="menu-item" onClick={() => navigate("/settings")}>
                                <SettingsIcon></SettingsIcon>
                                <Typography className="menu-text">Settings</Typography>
                            </MenuItem>
                            <MenuItem className="menu-item" onClick={logout}>
                                <LogoutIcon color="error"></LogoutIcon>
                                <Typography color={"red"} className="menu-text">Log Out</Typography>
                            </MenuItem>
                        </Menu>
                    </div>
                </>
            }
        </div>
    );
}

export default Profile;