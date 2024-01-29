import React, { useState } from "react";
import './ChatContent.css';
import Typewriter from 'typewriter-effect';
import { useAppSelector } from "../app/hooks";
import { selectChatbotState } from "../features/chatbot/chatbotSlice";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

enum ChatRole {
    INTRO = 0,
    ANSWER = 1
}

interface AnimatedTextProps {
    text: string;
    role: ChatRole;
}

function ChatContent() {
    const chatbot = useAppSelector(selectChatbotState);  
    const [currentRole, setCurrentRole] = useState(ChatRole.INTRO);

    const openHighlight = () => {
        if (chatbot.highlight !== "") {
            fetch(`data:application/pdf;base64,${chatbot.highlight}`)
                .then(res => res.blob())
                .then(blob => {
                const pdfUrl = URL.createObjectURL(blob);
                window.open(pdfUrl, '_blank');
                }
            );
        }
    };

    const AnimatedText = ({ text, role }: AnimatedTextProps) => {
        let isAnimated = false;

        switch(role) {
            case ChatRole.INTRO:
                isAnimated = (chatbot.question === "") && (chatbot.answer === "");
                break;
            case ChatRole.ANSWER:
                isAnimated = (chatbot.question !== "") && (chatbot.answer !== "");
                break;
        }

        isAnimated &&= role === currentRole

        return isAnimated ? 
            <Typewriter 
                options={{ cursor: "|", delay: 0 }} 
                onInit={(typewriter) => {
                    typewriter.typeString(text).callFunction(() => {
                        setCurrentRole((currentRole + 1) % 2);
                    }).start() 
                }}
            /> 
        : role === ChatRole.ANSWER && chatbot.status !== 'failed' ? (
            <p style={{ margin: 0 }}>
                { text }
                <div style={{ display: 'inline-block', position: 'relative' }}>
                    <FormatQuoteIcon 
                        style={{ 
                            verticalAlign: 'bottom', 
                            marginLeft: 5, 
                            fontSize: 'medium', 
                            backgroundColor: "#b91c1c", 
                            borderRadius: 5, 
                            padding: '2px 3px 2px 2px',
                            cursor: 'pointer' 
                        }}
                        onClick={openHighlight}
                    />
                </div>
            </p>
        ) : text;
    }; 

    const ChatbotPending = () => (
        <div style={{ width: 30 }}>
            <Typewriter 
                options={{ 
                    cursor: "", 
                    delay: 75,
                    deleteSpeed: 0,
                    loop: true
                }}
                onInit={(typewriter) => {
                    typewriter.typeString("• • •").pauseFor(0).deleteAll(0).start() 
                }}
            /> 
        </div>
    );

    return (
        <div className="chat-content">
            <div className="bot-bubble">
                <AnimatedText 
                    role={ChatRole.INTRO} 
                    text={"Hi! I can answer any question about the syllabus. What do you want to know?"}
                />
            </div>
            {
                chatbot.question !== "" ? 
                    <div className="user-bubble">
                        {chatbot.question} 
                    </div> 
                : 
                    <></>
            }
            {
                chatbot.answer !== "" ?
                    <div className="bot-bubble">
                        <AnimatedText 
                            role={ChatRole.ANSWER} 
                            text={chatbot.answer} 
                        />
                    </div> 
                : chatbot.answer === "" && chatbot.status === "loading" ? 
                    <div className="bot-bubble">
                        <ChatbotPending /> 
                    </div> 
                : 
                    <></>
            }
        </div>
    );
}

export default ChatContent;