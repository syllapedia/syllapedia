import { useState } from "react";
import "./UploadSyllabus.css"
import { Button, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

function UploadSyllabus({syllabus, handleSyllabus, size}: {syllabus: string, handleSyllabus: (event: React.ChangeEvent<HTMLInputElement>) => void, size: "small" | "medium"}) {
    const [file, setFile] = useState<File | null>(null);
    const openFile = () => {
        if (file) {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        }
    };
    return (
        <div style={{display:"flex"}}>
            <Button
                variant="contained"
                size={size}
                component="label"
                color="primary"
                startIcon={<UploadIcon />}
                className="upload-button"
            >
                Upload Syllabus
                <input
                    type="file"
                    onChange={(event) => {handleSyllabus(event);setFile(event.target.files ? event.target.files[0] : null);}}
                    hidden
                />
            </Button>
            {syllabus && 
                <Button 
                    onClick={() => openFile()} 
                    variant="text" 
                    size={size}
                    color="primary"
                    className="file-button"
                >
                    <Typography  align="center" className="file-button-text">
                        {file ? file.name : ""}
                    </Typography>
                </Button>
            }
        </div>
    );
}

export default UploadSyllabus;