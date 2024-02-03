import "./ChatPage.css";
import ChatInput from "../components/ChatInput";
import ChatContent from "../components/ChatContent";

function ChatPage() {
    return (
        <div className="chat-page">
            <div className="scrollable-chat">
                <ChatContent />
            </div>
            <ChatInput />
        </div>
    );
}

export default ChatPage;