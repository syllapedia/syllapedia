import React, { useState } from "react";
import './ChatInput.css';
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectChatbotState, updateQuestion, processQuestion, resetChatbot } from "../features/chatbot/chatbotSlice";
import SendIcon from '@mui/icons-material/Send';
import ReplayIcon from '@mui/icons-material/Replay';
import { IconButton } from '@mui/material';

function ChatInput() {
    const chatbot = useAppSelector(selectChatbotState);
    const dispatch = useAppDispatch();

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
            <form className="input-container" style={{ opacity: isEnabled ? 1 : 0.3 }} onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className="text-input" 
                    placeholder="Message..."
                    onChange={handleInputChange}
                    value={message}
                    disabled={!isEnabled}    
                />
                <IconButton type="submit" disableRipple sx={{ padding: 0 }} disabled={!isEnabled}>
                    <SendIcon 
                        style={{ 
                            height: 30, 
                            margin: 3, 
                            padding: "0px 12px 0px 15px", 
                            backgroundColor: '#b91c1c', 
                            color: '#ffffff', 
                            borderRadius: 19 
                        }} 
                    />
                </IconButton>
            </form>
            <div className="disclaimer">Note: Syllapedia may make mistakes when answering requests or highlighting sources</div>
        </>
    );
}

export default ChatInput