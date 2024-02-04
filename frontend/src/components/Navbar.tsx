import React from 'react';
import './Navbar.css';
import Profile from './Profile';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Typography } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useTheme } from '@mui/material/styles';

function Navbar({title}: {title: string}) {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <div className="navbar">
            <div>
                {location.pathname === "/settings" && 
                    <IconButton size="large" onClick={() => navigate("/")} disableFocusRipple>
                        <KeyboardReturnIcon></KeyboardReturnIcon>
                    </IconButton>  
                }
            </div>
            <div>
                <Typography color={theme.palette.text.primary} className="title">
                    {title}
                </Typography>
            </div>
            <div>
                {location.pathname !== "/settings" && 
                    <Profile />
                }
            </div>
        </div>
    );
}

export default Navbar;