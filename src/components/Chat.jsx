import { useState, useEffect, useRef } from "react";
import "../styles/chat.css";

function Chat({ socket, roomId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }
  }, [socket]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const messageData = {
        roomId,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        user: "You", // In a real app, this would come from user context
      };
      socket.emit("send-message", messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-header-content">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="header-icon">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10c.55 0 1 .45 1 1s-.45 1-1 1H7c-.55 0-1-.45-1-1s.45-1 1-1zm0 3h7c.55 0 1 .45 1 1s-.45 1-1 1H7c-.55 0-1-.45-1-1s.45-1 1-1z"/>
          </svg>
          <h3>In-call messages</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">💬</div>
            <p>Messages can only be seen by people in the call</p>
            <p className="subtitle">and are deleted when the call ends.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="message">
              <div className="message-content">
                <span className="message-user">{msg.user}</span>
                <span className="message-text">{msg.message}</span>
              </div>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message to everyone"
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="send-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
