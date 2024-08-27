import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { SendHorizontal, Sparkles } from "lucide-react";
import WelcomeMessage from "./Components/WelcomeMessage";
import MessageBubble from "./Components/MessageBubble";
import LoadingDots from "./Components/LoadingDots";
import "./index.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:9080/query", { input });
      const aiMessage = {
        type: "ai",
        content: res.data.answer,
        sources: res.data.sources,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      const errorMessage = {
        type: "error",
        content: `Error: ${error.message}`,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setInput("");
    setMessages([]);
  };

  return (
    <section className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="py-5 px-14 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center space-x-8">
            <div className="relative">
              <svg width="0" height="0">
                <linearGradient
                  id="icon-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop stopColor="#00c6ff" offset="0%" />
                  <stop stopColor="#0072ff" offset="50%" />
                  <stop stopColor="#00ffb4" offset="100%" />
                </linearGradient>
              </svg>

              <Sparkles
                style={{ stroke: "url(#icon-gradient)" }}
                className="w-4 h-4 absolute -top-[7px] -left-[11px]"
              />
              <Sparkles
                style={{ stroke: "url(#icon-gradient)" }}
                className="w-9 h-9"
              />
              <Sparkles
                style={{ stroke: "url(#icon-gradient)" }}
                className="w-4 h-4 absolute -bottom-[7px] -right-[11px]"
              />
            </div>
            <h1 className="text-2xl font-semibold">IMS Assistant</h1>
          </div>
          <button
            className="flex items-center space-x-3 px-4 py-2 rounded-full shadow-md"
            onClick={handleNewChat} // Call handleNewChat on click
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00c6ff" />
                  <stop offset="50%" stopColor="#0072ff" />
                  <stop offset="100%" stopColor="#00ffb4" />
                </linearGradient>
              </defs>
              <path d="M12 5v14M5 12h14" />
            </svg>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#00ffb4]">
              New Chat
            </p>
          </button>
        </div>
        <div className="relative">
          <div className="h-[600px] overflow-y-auto py-12 px-12">
            {messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}
              </AnimatePresence>
            )}
            {isLoading && <LoadingDots />}
            <div ref={messagesEndRef} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/90 to-white/0"></div>
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow mx-16 my-4 px-4 py-3 rounded-full border border-gray-300 ring-0 focus:ring-0 outline-none transition-all duration-300 ease-in-out"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            className={`absolute right-[70px] p-2 rounded-md ${
              isLoading || !input.trim()
                ? "text-gray-300 cursor-not-allowed"
                : "text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
            }`}
            disabled={isLoading || !input.trim()}
          >
            <SendHorizontal className="w-8 h-8" />
          </button>
        </form>
      </div>
    </section>
  );
}

export default App;
