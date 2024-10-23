import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Paperclip, Send } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  attachments?: File[];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId] = useState(() => localStorage.getItem('userId') || uuidv4());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('userId', userId);
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: input,
      attachments: attachments,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setIsProcessing(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: uuidv4(),
        type: 'bot',
        content: `Hello! I'm a chatbot. You said: "${input}". You also attached ${attachments.length} file(s).`,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">AI Chatbot</h1>
        </div>
      </header>

      <main className="flex-grow overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isProcessing && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Bot size={24} />
                <span>Processing...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              {attachments.length > 0 && (
                <span className="text-sm text-gray-600">
                  {attachments.length} file(s) attached
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
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

export default App;