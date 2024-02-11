import "./CreateTab.css";
import "./Sidebar.css";
import { ListItem, ListItemButton, ListItemText} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function CreateTab({open, handleCreateClick}: {open: boolean, handleCreateClick: (open: boolean) => void}) {
    return (
        <ListItem className="tab">
            <ListItemButton disableRipple className="tab" onClick={() => handleCreateClick(true)}>
                <AddIcon className="tab-icon"></AddIcon>
                {open && <ListItemText primary="Create" />}
            </ListItemButton>
        </ListItem>
    )
}

export default CreateTab;