import "./CourseSearch.css";
import { subjectToCode } from "../models/courseModels";
import { TextField, Autocomplete } from '@mui/material';

function SubjectDropdown({handleSubject, size, defaultValue}: {handleSubject: (value: string | null) => void, size: "small" | "medium", defaultValue?: string}) {
    return (
        <Autocomplete
            options={Object.keys(subjectToCode)}
            defaultValue={defaultValue}
            renderInput={(params) => (
                <TextField {...params} label="Subject" size={size}/>
            )}
            onChange={(event, value) => handleSubject(value)}
        />
    )
}

export default SubjectDropdown;