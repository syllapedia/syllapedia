import { useState, useEffect } from "react";
import "./UploadSyllabus.css"
import { Button, useTheme } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { NewSyllabus } from "../models/courseModels";

interface uploadSyllabusProperties {
    syllabus: NewSyllabus;
    handleSyllabus: (file: File | null) => void;
    size: "small" | "medium";
    disabled?: boolean;
}

function UploadSyllabus({syllabus, handleSyllabus, size, disabled=false}: uploadSyllabusProperties) {
    const theme = useTheme()
    const [file, setFile] = useState<File | null>(null);
    useEffect(() => {
        if (syllabus.base64) {
            const fetchFile = async () => {
                const base64Response = await fetch(`data:application/pdf;base64,${syllabus.base64}`);
                const blob = await base64Response.blob();
                const newFile = new File([blob], file ? file.name : "syllabus.pdf", { type: syllabus.fileType });
                setFile(newFile);
            };
            fetchFile();
        }
    }, [syllabus.base64]);
    const openFile = () => {
        if (file) {
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, "_blank");
        }
    };
    return (
        <div style={{display:"flex", flexDirection: "column"}}>
            <Button
                variant="contained"
                size={size}
                component="label"
                color="primary"
                disabled={disabled}
                startIcon={<UploadIcon />}
                className="upload"
            >
                Upload Syllabus
                <input
                    type="file"
                    onChange={(event) => {
                        if (event.currentTarget.files)    {
                            handleSyllabus(event.currentTarget.files[0]);
                            setFile(event.currentTarget.files[0]);
                        }
                    }}
                    hidden
                    accept="application/pdf, text/html"
                />
            </Button>
            {syllabus.base64 && 
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