import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

import { stockInfo } from "./stockInfo";

const App = () => {

  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "system",
      text: stockInfo,
    },
  ]);

  const [showChatbot, setShowChatbot] = useState(false);

  const chatBodyRef = useRef(null);

  const quickPrompts = useMemo(
    () => [
      "Best tech stocks",
      "Analyze Tesla",
      "NVIDIA prediction",
      "Top AI companies",
    ],
    []
  );

  // BOT RESPONSE
  const generateBotResponse = async (history) => {

    setChatHistory((prev) => [
      ...prev,
      { role: "model", text: "" },
    ]);

    try {

      const lastUserMessage =
        history[history.length - 1]?.text || "";

      // BACKEND URL
      const BASE =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

      const response = await fetch(
        `${BASE}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: lastUserMessage,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "Something went wrong"
        );
      }

      let index = 0;

      const text = data.reply || "No response";

      const interval = setInterval(() => {

        index++;

        setChatHistory((prev) => {

          const updated = [...prev];

          updated[updated.length - 1].text =
            text.slice(0, index);

          return updated;
        });

        if (index >= text.length) {
          clearInterval(interval);
        }

      }, 15);

    } catch (error) {

      setChatHistory((prev) => {

        const updated = [...prev];

        updated[updated.length - 1].text =
          error.message || "Server error";

        return updated;
      });
    }
  };

  // SEND MESSAGE
  const handleSendMessage = (userMessage) => {

    if (!userMessage.trim()) return;

    const newHistory = [
      ...chatHistory,
      {
        role: "user",
        text: userMessage,
      },
    ];

    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    generateBotResponse(newHistory);
  };

  // AUTO SCROLL
  useEffect(() => {

    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });

  }, [chatHistory]);

  return (
    <div
      className={`container ${
        showChatbot ? "show-chatbot" : ""
      }`}
    >
      {/* TOGGLER */}
      <button
        onClick={() =>
          setShowChatbot((prev) => !prev)
        }
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">
          monitoring
        </span>

        <span className="material-symbols-rounded">
          close
        </span>
      </button>

      {/* CHATBOX */}
      <div className="chatbot-popup">

        {/* HEADER */}
        <div className="chat-header">

          <div className="header-info">

            <ChatbotIcon />

            <div>
              <h2 className="logo-text">
                StockPulse AI
              </h2>

              <p className="logo-subtext">
                Smart Market Insights
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              setShowChatbot((prev) => !prev)
            }
            className="material-symbols-rounded"
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* BODY */}
        <div
          ref={chatBodyRef}
          className="chat-body"
        >

          <div className="message bot-message">
            <ChatbotIcon />

            <p className="message-text">
              👋 Welcome to <b>StockPulse AI</b>
              <br />
              Ask about stocks, trends,
              predictions, or analysis 📈
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage
              key={index}
              chat={chat}
            />
          ))}
        </div>

        {/* QUICK PROMPTS */}
        <div className="quick-prompts">

          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() =>
                handleSendMessage(prompt)
              }
            >
              {prompt}
            </button>
          ))}

        </div>

        {/* FOOTER */}
        <div className="chat-footer">
          <ChatForm
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* DISCLAIMER */}
        <p
          style={{
            fontSize: "10px",
            textAlign: "center",
            padding: "5px 10px",
            color: "#777",
          }}
        >
          This is AI-generated analysis and not
          financial advice.
        </p>
      </div>
    </div>
  );
};

export default App;