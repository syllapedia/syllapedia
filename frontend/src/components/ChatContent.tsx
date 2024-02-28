import { useEffect, useState } from "react";
import './ChatContent.css';
import Typewriter from 'typewriter-effect';
import { useAppSelector } from "../app/hooks";
import { selectChatbotState } from "../features/chatbot/chatbotSlice";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { useTheme } from "@mui/material";

enum ChatRole {
    INTRO = 0,
    ANSWER = 1
}

interface AnimatedTextProps {
    text: string;
    role: ChatRole;
}

function ChatContent() {
    const theme = useTheme()
    const chatbotState = useAppSelector(selectChatbotState);  
    const [isTyped, setIsTyped] = useState(false);

    useEffect(() => {
        setIsTyped(false);
    }, [chatbotState.course, chatbotState.answer])

    const openHighlight = (window: Window) => {
        if (chatbotState.highlight) {
            fetch(`data:application/pdf;base64,${chatbotState.highlight}`)
                .then(res => res.blob())
                .then(blob => {
                    const pdfUrl = URL.createObjectURL(blob);
                    window.location.href = pdfUrl;
                }
            );
        }
    };

    const AnimatedText = ({ text, role }: AnimatedTextProps) => {
        let isAnimated = false;

        switch(role) {
            case ChatRole.INTRO:
                isAnimated = (chatbotState.question === "") && (chatbotState.answer === "");
                break;
            case ChatRole.ANSWER:
                isAnimated = (chatbotState.question !== "") && (chatbotState.answer !== "");
                break;
        }

        isAnimated &&= !isTyped

        return isAnimated ? 
            <Typewriter 
                options={{ cursor: "|", delay: 0 }} 
                onInit={(typewriter) => {
                    typewriter.typeString(text).callFunction(() => {
                        setIsTyped(true);
                    }).start() 
                }}
            /> 
        : role === ChatRole.ANSWER && chatbotState.status !== 'failed' ? (
            <div style={{ margin: 0 }}>
                { text }
                <div style={{ display: 'inline-block', position: 'relative' }}>
                    <FormatQuoteIcon 
                        style={{ 
                            verticalAlign: 'bottom', 
                            marginLeft: 5, 
                            fontSize: 'medium', 
                            color: "#e5e5e5",
                            backgroundColor: theme.palette.primary.main, 
                            borderRadius: 5, 
                            padding: '2px 3px 2px 2px',
                            cursor: 'pointer' 
                        }}
                        onClick={() => {
                            const windowReference = window.open('', '_blank');
                            if (windowReference) {
                                openHighlight(windowReference);
                            }
                        }}
                    />
                </div>
            </div>
        ) : text;
    }; 

    const ChatbotPending = () => (
        <div style={{ minWidth: 30 }}>
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

    return chatbotState.course ? (
        <div className="chat-content">
            <div className="bot-bubble" style={{backgroundColor: theme.palette.background.default}}>
                <AnimatedText 
                    role={ChatRole.INTRO} 
                    text={"Hi! I can answer any question about the syllabus. What do you want to know?"}
                />
            </div>
            {
                chatbotState.question !== "" ? 
                    <div className="user-bubble" style={{backgroundColor: theme.palette.primary.main}}>
                        {chatbotState.question} 
                    </div> 
                : 
                    <></>
            }
            {
                chatbotState.answer !== "" ?
                    <div className="bot-bubble" style={{backgroundColor: theme.palette.background.default}}>
                        <AnimatedText 
                            role={ChatRole.ANSWER} 
                            text={chatbotState.answer} 
                        />
                    </div> 
                : chatbotState.answer === "" && chatbotState.status === "loading" ? 
                    <div className="bot-bubble" style={{backgroundColor: theme.palette.background.default}}>
                        <ChatbotPending /> 
                    </div> 
                : 
                    <></>
            }
        </div>
    ) : <></>;
}

export default ChatContent;