import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Profile from './Profile';
import { IconButton, Typography } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useTheme } from '@mui/material/styles';

function Navbar({title}: {title?: string}) {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    return (
        <div className="navbar">
            <div>
                {["/settings", "/analytics"].reduce((acc, e) => acc || (location.pathname === e), false) && 
                    <IconButton size="large" onClick={() => navigate("/chat")} disableFocusRipple sx={{padding: "18px"}}>
                        <KeyboardReturnIcon></KeyboardReturnIcon>
                    </IconButton>  
                }
            </div>
            <div>
                <Typography color={theme.palette.text.primary} variant="h6" className="title">
                    {title ? title : ""}
                </Typography>
            </div>
            <div>
                {["/settings", "/analytics"].reduce((acc, e) => acc && (location.pathname !== e), true)  && 
                    <Profile />
                }
            </div>
        </div>
    );
}

export default Navbar;