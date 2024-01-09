import "./SavedTab.css";
import "./Sidebar.css";
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

function SavedTab({open, handleSavedClick}: {open: boolean, handleSavedClick: () => void}) {
    return (
        <ListItem className="tab">
            <ListItemButton disableRipple className="tab" onClick={() => handleSavedClick()}>
                <BookmarkBorderIcon className="tab-icon"></BookmarkBorderIcon>
                {open && <ListItemText primary="Saved"/>}
            </ListItemButton>
        </ListItem>
    )
}

export default SavedTab;