import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "../ChatMessage";
import { Bot, User, Paperclip, Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import "./Dashboard.css";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  attachments?: File[];
}

function ChatBotDashBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId] = useState(() => localStorage.getItem("userId") || uuidv4());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const fetchChatResponse = async (query: string, uid: string) => {
    const url = "http://econ-demo.turiyatree.in:5000/chat";
    const headers = {
      "Content-Type": "application/json",
    };
    const payload = { query, uid };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;
    if (isProcessing) return; // Prevent multiple submissions

    const userMessage: Message = {
      id: uuidv4(),
      type: "user",
      content: input,
      attachments: attachments,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsProcessing(true);

    try {
      const botResponse = await fetchChatResponse(input, userId);
      const botMessage: Message = {
        id: uuidv4(),
        type: "bot",
        content: botResponse,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          type: "bot",
          content:
            "I'm having trouble responding right now. Please try again later.",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };



  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-300 to-white">
      <main className="flex-grow overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <header className="bg-white shadow-md py-4">
            <div className="max-w-2xl mx-auto px-4 flex items-center justify-center">
              <h1 className="text-3xl font-extrabold text-blue-600">
                ECON Chatbot
              </h1>
            </div>
          </header>
          <div
            ref={chatContainerRef}
            className="flex-grow p-4 space-y-4 bg-white rounded-lg shadow-inner overflow-y-auto scrollbar-hide"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {/* <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style> */}
            {messages.map((message) => (
              <ChatMessage
              key={message.id} 
              message={message}
              />
            ))}
            {isProcessing && (
              <div className="flex items-center space-x-2 text-gray-500 animate-pulse">
                <Bot size={24} />
                <span>Processing...</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 bg-blue shadow-lg rounded-t-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-full hover:bg-blue-100 focus:outline-none focus:ring focus:ring-blue-300 transition ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isProcessing}
              >
                <Paperclip size={20} className="text-blue-600" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
                disabled={isProcessing}
              />
              {attachments.length > 0 && (
                <span className="text-sm text-gray-700">
                  {attachments.length} file(s) attached
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isProcessing ? "Please wait..." : "Type your message..."
                }
                className={`flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isProcessing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={isProcessing}
              />
              <button
                type="submit"
                className={`bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isProcessing}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ChatBotDashBoard;
