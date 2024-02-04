import React, { useState } from "react";
import './ChatInput.css';
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectChatbotState, updateQuestion, processQuestion, resetChatbot } from "../features/chatbot/chatbotSlice";
import SendIcon from '@mui/icons-material/Send';
import ReplayIcon from '@mui/icons-material/Replay';
import { IconButton, useTheme } from '@mui/material';

function ChatInput() {
    const chatbot = useAppSelector(selectChatbotState);
    const dispatch = useAppDispatch();

    const theme = useTheme()
    const [message, setMessage] = useState('');
    const [isEnabled, setIsEnabled] = useState(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");
        
        if (message.length !== 0) {
            setIsEnabled(false);
            dispatch(updateQuestion(message));
            dispatch(processQuestion());
        }
    }

    const handleReset = () => {
        setIsEnabled(true);
        dispatch(resetChatbot());
    }

    return (
        <>
            {
                isEnabled || chatbot.status === "loading" ? 
                    <div style={{ height: 25 }}></div> 
                :
                    <div className="reset-button" onClick={handleReset}>
                        <ReplayIcon style={{ paddingRight: 5 }} />
                        <div style={{ marginBottom: 3.5 }}>Reset</div>
                    </div>
            }
            <form className="input-container" style={{ opacity: isEnabled ? 1 : 0.3, borderColor: theme.palette.primary.main }} onSubmit={handleSubmit}>
                <input 
                    type="text"
                    className="text-input" 
                    placeholder="Message..."
                    onChange={handleInputChange}
                    value={message}
                    disabled={!isEnabled}    
                />
                <IconButton type="submit" disableRipple disabled={!isEnabled}>
                    <SendIcon 
                        style={{ 
                            backgroundColor: theme.palette.primary.main,
                            padding: "7px",
                            color: "#e5e5e5",
                            borderRadius: "100%" 
                        }} 
                    />
                </IconButton>
            </form>
            <div className="disclaimer">Note: Syllapedia may make mistakes when answering questions or highlighting sources</div>
        </>
    );
}

export default ChatInput