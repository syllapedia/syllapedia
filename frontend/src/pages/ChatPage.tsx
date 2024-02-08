import "./ChatPage.css";
import ChatInput from "../components/ChatInput";
import ChatContent from "../components/ChatContent";
import { selectChatbotState } from "../features/chatbot/chatbotSlice";
import { useAppSelector } from "../app/hooks";

function ChatPage() {
    const chatbot = useAppSelector(selectChatbotState);  
    return (
        <div className="chat-page">
            <div className="title">
                {chatbot.course ? chatbot.course.name : "No Course Selected"}
            </div>
            <div className="scrollable-chat">
                <ChatContent />
            </div>
            <ChatInput />
        </div>
    );
}

export default ChatPage;