import "./FindTab.css";
import "./Sidebar.css";
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function FindTab({open, handleFindClick}: {open: boolean, handleFindClick: () => void}) {
    return (
        <ListItem className="tab">
            <ListItemButton disableRipple className="tab" onClick={() => handleFindClick()}>
                <SearchIcon className="tab-icon"></SearchIcon>
                {open && <ListItemText primary="Find" />}
            </ListItemButton>
        </ListItem>
    )
}

export default FindTab;