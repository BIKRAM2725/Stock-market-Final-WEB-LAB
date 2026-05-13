import React, { useRef } from "react";

const ChatForm = ({ onSendMessage }) => {
  const inputRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();

    if (!userMessage) return;

    inputRef.current.value = "";

    onSendMessage(userMessage);
  };

  return (
    <form
      action="#"
      className="chat-form"
      onSubmit={handleFormSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask about any stock..."
        className="message-input"
        required
        style={{
          flex: 1,
          minWidth: 0,
        }}
      />

      <button
        className="material-symbols-rounded"
        style={{
          flexShrink: 0,
        }}
      >
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;