import "./CourseSearch.css"
import { TextField} from '@mui/material';

function CourseInput({label, size, handleInput}: {label: string, size: "small" | "medium", handleInput: (value: string | null) => void}) {
    
    return (
        <TextField 
            label={label}
            variant="outlined" 
            size={size} 
            onChange={(event) => handleInput(event.target.value)}
            fullWidth
        />
    )
}

export default CourseInput;