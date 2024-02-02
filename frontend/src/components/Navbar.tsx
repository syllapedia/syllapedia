import React from 'react';
import './Navbar.css';
import Profile from './Profile';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useTheme } from '@mui/material/styles';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <>
            {location.pathname === "/settings" ?
                <div className="navbar-left">
                    <IconButton size="large" onClick={() => navigate("/")}>
                        <KeyboardReturnIcon></KeyboardReturnIcon>
                    </IconButton>  
                </div>
            : 
                <div className="navbar-right">
                    <Profile />
                </div>
            }
        </>
    );
}

export default Navbar;