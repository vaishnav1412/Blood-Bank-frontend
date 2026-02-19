import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Welcome message
  useEffect(() => {
    setChat([
      {
        sender: "bot",
        text: "👋 Hello! I'm your Blood Donation Assistant. How can I help you today?",
      },
    ]);
  }, []);

  // Send message
  const sendMessage = async (customMessage) => {
    const finalMessage = customMessage || message;
    if (!finalMessage.trim()) return;

    // Add user message
    setChat((prev) => [...prev, { sender: "user", text: finalMessage }]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/doner/chatbot",
        { message: finalMessage }
      );

      let replyText = res.data.reply;
      replyText = replyText.replace(finalMessage, "").trim();

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: replyText || "🤖 Sorry, I couldn't understand.",
        },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "😔 Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  // Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-4  right-4 z-[9999] font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-pink_dark  text-white rounded-full p-4  shadow-lg hover:scale-110 transition"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 rounded-2xl shadow-2xl overflow-hidden border-2 border-button_border bg-white">
          {/* Header */}
          <div className="bg-pink_dark text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">Blood Donation AI 🤖</h2>
              <p className="text-pink_super_light text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-green rounded-full animate-pulse"></span>
                Online Assistant
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold hover:text-gray transition"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 bg-off_white">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`mb-3 flex ${
                  c.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow border ${
                    c.sender === "user"
                      ? "bg-pink_light text-white border-pink_dark"
                      : "bg-white text-dark border-gray"
                  }`}
                >
                  {c.text}
                </div>
              </div>
            ))}

            {/* Typing */}
            {isTyping && (
              <p className="text-light text-sm mt-2">🤖 Typing...</p>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1 rounded-full px-4 py-2 border border-gray outline-none focus:ring-2 focus:ring-pink_dark"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!message.trim() || isTyping}
                className="bg-button_original text-white px-4 rounded-full shadow-md hover:opacity-90 disabled:bg-gray"
              >
                Send
              </button>
            </div>

            {/* Quick Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Where can I donate blood?",
                "Eligibility criteria?",
                "How to register as donor?",
              ].map((q, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1 rounded-full bg-pink_super_light text-dark_gray hover:opacity-80 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
