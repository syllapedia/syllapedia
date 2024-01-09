import { CourseInfo } from "../models/courseModels";
import "./Sidebar.css"
import "./SavedCourses.css";
import { Typography, List, ListItem, ListItemButton, ListItemText, IconButton} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Create from '@mui/icons-material/Create'

function SavedCourses({userId, userCourses, selectedCourse, setSelectedCourse}: {userId: string, userCourses: CourseInfo[], selectedCourse: {name: string, instructor: string}, setSelectedCourse: ({name, instructor}: {name: string, instructor: string}) => void}) {
    const editCourse = (/* Add edit functionality */) => {};
    const removeCourse = (/* Add remove functionality */) => {};
    return (
        <List disablePadding className="tab-content">
            {userCourses.map(course => (
                <ListItem key={course.name} disablePadding>
                    <ListItemButton 
                        disableTouchRipple 
                        onClick={() => {
                            setSelectedCourse({name:course.name, instructor:course.instructor.name});
                        }}
                        className={`saved-course${(selectedCourse.name === course.name && selectedCourse.instructor === course.instructor.name)
                            ? "-selected"
                            : ""}`}
                    >
                        <Typography variant="h6" style={{width:"100%"}}>
                            <ListItemText primary={course.name + "\n"} />
                            <ListItemText secondary={"By " + course.instructor.name} />
                        </Typography>
                        {userId === course.instructor._id ?
                            <IconButton disableTouchRipple onClick={() => editCourse()}>
                                <Create></Create>
                            </IconButton>
                            :
                            <IconButton disableTouchRipple onClick={() => removeCourse()}>
                                <BookmarkIcon color="primary"></BookmarkIcon>
                            </IconButton>
                        }
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}

export default SavedCourses;