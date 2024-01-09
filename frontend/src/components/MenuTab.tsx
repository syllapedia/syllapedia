import "./MenuTab.css";
import "./Sidebar.css";
import { ListItem, ListItemText, IconButton } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

function MenuTab({open, handleDrawerToggle}: {open: boolean, handleDrawerToggle: () => void}) {
    return (
        <ListItem className="tab">
            <IconButton disableTouchRipple className="tab" onClick={() => handleDrawerToggle()} size="medium">
                <MenuIcon className="tab-icon"></MenuIcon>
            </IconButton>
            {open && <ListItemText primary="Syllapedia" />}
        </ListItem>
    )
}

export default MenuTab;