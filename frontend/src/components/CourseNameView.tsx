import "./CourseNameView.css";
import { Typography} from '@mui/material';

function CourseNameView ({code, number, title}: {code: string, number: string, title: string}) {
    return (
        <Typography className="course-name-view"> 
            {code} {number} - {title}
        </Typography>
    );
}

export default CourseNameView;