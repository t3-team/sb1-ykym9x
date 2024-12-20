import React from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import FeedbackButtons from "./FeedbackButtons";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  attachments?: File[];
}

interface ChatMessageProps {
  message: Message;
  // onFeedback?: (messageId: string, isPositive: boolean) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex space-x-2 ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          {isUser ? (
            <User size={20} className="text-white" />
          ) : (
            <Bot size={20} className="text-gray-600" />
          )}
        </div>
        <div className="flex flex-col">
        <div
          className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-lg p-5 ${
            isUser ? "bg-blue-500 text-white" : "bg-blue-100 text-gray-800"
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              ol: ({ children }) => (
                <ol className="list-decimal ml-5 space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="pl-1 text-left">
                  <div className="inline-block align-top">{children}</div>
                </li>
              ),
              p: ({ children }) => <p className="mb-3">{children}</p>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold">Attachments:</p>
              <ul className="list-disc list-inside">
                {message.attachments.map((file, index) => (
                  <li key={index} className="text-sm">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* {!isUser && onFeedback && (
            <FeedbackButtons messageId={message.id} onFeedback={onFeedback} />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
