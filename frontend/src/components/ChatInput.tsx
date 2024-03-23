import React, { useEffect, useState } from "react";
import './ChatInput.css';
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectChatbotState, updateQuestion, processQuestion, resetChatbot } from "../features/chatbot/chatbotSlice";
import SendIcon from '@mui/icons-material/Send';
import ReplayIcon from '@mui/icons-material/Replay';
import LoopIcon from '@mui/icons-material/Loop';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { IconButton, Input, useTheme } from '@mui/material';
import { abortHttpRequests } from "../services/httpService";

function ChatInput() {
    const chatbotState = useAppSelector(selectChatbotState);
    const dispatch = useAppDispatch();

    const theme = useTheme()
    const [message, setMessage] = useState('');
    const [isEnabled, setIsEnabled] = useState(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value);

    const handleSubmit = async (event?: React.FormEvent) => {
        if (event) event.preventDefault();
        setMessage("");
        
        if (message.length !== 0) {
            setIsEnabled(false);
            dispatch(updateQuestion(message));
            dispatch(processQuestion());
        }
    }

    const handleReset = () => {
        setIsEnabled(chatbotState.course ? true : false);
        dispatch(resetChatbot());
    }

    const handleRegen = () => {
        const question = chatbotState.question;

        dispatch(resetChatbot());
        dispatch(updateQuestion(question));
        dispatch(processQuestion());
    }

    const hexToRgba = (hex: string, opacity: number): string => {
        hex = hex.replace('#', '');
    
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
    
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    useEffect(() => handleReset(), [chatbotState.course]);

    return (
        <>
            {
                !chatbotState.course || isEnabled ? 
                    <div style={{ height: 25 }}></div> 
                : chatbotState.status === "loading" ?
                    <div className="reset-button" onClick={abortHttpRequests}>
                        <DoDisturbIcon style={{ paddingRight: 5 }} />
                        <div style={{ marginBottom: 3.5 }}>Cancel</div>
                    </div>
                :
                    <div className="reset-button" onClick={handleRegen}>
                        <LoopIcon style={{ paddingRight: 5 }} />
                        <div style={{ marginBottom: 3.5 }}>Regenerate</div>
                    </div>
            }
            <form className="input-container" style={{ borderColor: hexToRgba(theme.palette.primary.main, isEnabled ? 1 : 0.3) }} onSubmit={handleSubmit}>
                <Input 
                    type="text"
                    className="text-input" 
                    placeholder="Message..."
                    onChange={handleInputChange}
                    value={message}
                    disabled={!isEnabled}
                    disableUnderline
                    style={{ opacity: isEnabled ? 1 : 0.3 }}
                />
                <IconButton 
                    type="submit" 
                    disableRipple 
                    disabled={chatbotState.status === "loading"} 
                    onClick={!isEnabled && chatbotState.status !== "loading" ? handleReset : () => {}} 
                >
                    {
                        !chatbotState.course || isEnabled || chatbotState.status === "loading" ?
                            <SendIcon 
                                style={{
                                    opacity: isEnabled ? 1 : 0.3, 
                                    backgroundColor: theme.palette.primary.main,
                                    padding: "7px",
                                    color: "#e5e5e5",
                                    borderRadius: "100%" 
                                }} 
                            />
                        :    
                            <ReplayIcon 
                                style={{ 
                                    backgroundColor: theme.palette.primary.main,
                                    padding: "7px",
                                    color: "#e5e5e5",
                                    borderRadius: "100%" 
                                }} 
                            />
                    }
                </IconButton>
            </form>
            <div className="disclaimer">Note: Syllapedia may make mistakes when answering questions or highlighting sources</div>
        </>
    );
}

export default ChatInput