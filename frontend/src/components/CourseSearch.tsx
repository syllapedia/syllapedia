import { useState } from "react";
import "./Sidebar.css"
import "./CourseSearch.css";
import { IconButton, Grid, List } from '@mui/material';
import SubjectDropdown from "./SubjectDropdown";
import CourseInput from "./CourseInput";
import SearchIcon from '@mui/icons-material/Search';

function CourseSearch() {    
    const [subject, setSubject] = useState("");
    const [number, setNumber] = useState("");
    const [title, setTitle] = useState("");
    const handleSubject = (value: string | null) => {
        if (value !== null) {
            setSubject(value);
        } else {
            setSubject("");
        }
    };
    const handleNumber = (value: string | null) => {
        if (value !== null) {
            setNumber(value);
        } else {
            setNumber("");
        }
    };
    const handleTitle = (value: string | null) => {
        if (value !== null) {
            setTitle(value);
        } else {
            setTitle("");
        }
    };
    const searchCourses = () => {/* Add search functionality */}
    return (
        <div className="tab-content">
            <Grid container spacing={1} className="search-components">
                <Grid item xs={7}>
                    <SubjectDropdown handleSubject={handleSubject} size="small"/>
                </Grid>
                <Grid item xs={5}>
                    <CourseInput handleInput={handleNumber} size="small" label="Number"/>
                </Grid>
                <Grid item xs style={{display:"flex"}}>
                    <CourseInput handleInput={handleTitle} size="small" label="Name"/>
                    <IconButton size="medium" onClick={() => searchCourses()} className="search-button">
                        <SearchIcon />
                    </IconButton>            
                </Grid>
            </Grid>
            <List>
                {/* Add searched courses here */}
            </List>
        </div>
    );    
}

export default CourseSearch;
