import React from "react";
import ChatbotIcon from "./ChatbotIcon";

const formatMessage = (text) => {
  return text
    .replace(/\n/g, "<br/>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/### (.*?)(<br\/>|$)/g, "<strong>$1</strong><br/>")
    .replace(/\* (.*?)(<br\/>|$)/g, "• $1<br/>");
};

const ChatMessage = ({ chat }) => {
  return (
    !chat.hideInChat && (
      <div
        className={`message ${
          chat.role === "model" ? "bot" : "user"
        }-message ${chat.isError ? "error" : ""}`}
      >
        {chat.role === "model" && <ChatbotIcon />}

        <p
          className="message-text"
          style={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            lineHeight: "1.5",
          }}
          dangerouslySetInnerHTML={{
            __html: formatMessage(chat.text),
          }}
        ></p>
      </div>
    )
  );
};

export default ChatMessage;