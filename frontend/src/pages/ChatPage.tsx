import "./ChatPage.css";
import ChatInput from "../components/ChatInput";
import ChatContent from "../components/ChatContent";
import { selectChatbotState } from "../features/chatbot/chatbotSlice";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useAppSelector } from "../app/hooks";

function ChatPage() {
    const chatbot = useAppSelector(selectChatbotState);  

    const openSyllabus = (window: Window) => {
        if (chatbot.course) {
            fetch(`data:application/pdf;base64,${chatbot.course.syllabus.pdf}`)
                .then(res => res.blob())
                .then(blob => {
                    const pdfUrl = URL.createObjectURL(blob);
                    window.location.href = pdfUrl;
                }
            );
        }
    }

    return (
        <div className="chat-page">
            <div className="title">
                {chatbot.course ? chatbot.course.name : "No Course Selected"}
            </div>
            {
                chatbot.course ?
                    <div 
                    className="subtitle" 
                    onClick={() => {
                        const windowReference = window.open('', '_blank');
                        if (windowReference) {
                            openSyllabus(windowReference);
                        }
                    }}>
                        View Full Syllabus
                        <OpenInNewIcon style={{ fontSize: 'medium', marginLeft: 5 }} />
                    </div> 
                : <></>
            }
            <div className="scrollable-chat">
                <ChatContent />
            </div>
            <ChatInput />
        </div>
    );
}

export default ChatPage;