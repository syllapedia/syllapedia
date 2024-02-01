import "./CourseSearch.css";
import { TextField } from '@mui/material';

function CourseInput({ label, size, handleInput, defaultValue }: { label: string, size: "small" | "medium", handleInput: (value: string | null) => void, defaultValue?: string }) {
    
    return (
        <TextField 
            label={label}
            defaultValue={defaultValue ? defaultValue : ""}
            variant="outlined" 
            size={size} 
            onChange={(event) => handleInput(event.target.value)}
            fullWidth
        />
    )
}

export default CourseInput;
