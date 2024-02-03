import "./CourseNameView.css";
import { Typography} from '@mui/material';

function CourseNameView({courseProperties}: {courseProperties: {subject: string, number: string, title: string}}) {
    return (
        <Typography fontSize="large" className="course-name-view"> 
            {courseProperties.subject || "______"} {courseProperties.number || "______"} - {courseProperties.title || "____________"}
        </Typography>
    );
}

export default CourseNameView;