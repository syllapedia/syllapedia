import { useState, useEffect } from "react";
import "./UploadSyllabus.css"
import { Button, useTheme } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

interface uploadSyllabusProperties {
    syllabus: string;
    handleSyllabus: (event: React.ChangeEvent<HTMLInputElement>) => void;
    size: "small" | "medium";
}

function UploadSyllabus({syllabus, handleSyllabus, size}: uploadSyllabusProperties) {
    const theme = useTheme()
    const [file, setFile] = useState<File | null>(null);
    useEffect(() => {
        if (syllabus) {
            const fetchFile = async () => {
                const base64Response = await fetch(`data:application/pdf;base64,${syllabus}`);
                const blob = await base64Response.blob();
                const newFile = new File([blob], "syllabus.pdf", { type: "application/pdf" });
                setFile(newFile);
            };
            fetchFile();
        }
    }, [syllabus]);
    const openFile = () => {
        if (file) {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, "_blank");
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
                    onChange={(event) => {handleSyllabus(event);}}
                    hidden
                    accept="application/pdf"
                />
            </Button>
            {syllabus && 
                <div 
                    onClick={() => openFile()} 
                    style={{ color: theme.palette.info.light }}
                    className="file-text"
                >
                    {file ? file.name : ""}
                </div>
            }
        </div>
    );
}

export default UploadSyllabus;