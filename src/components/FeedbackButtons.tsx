import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackButtonsProps {
  messageId: string;
  onFeedback: (messageId: string, isPositive: boolean) => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ messageId, onFeedback }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (isPositive: boolean) => {
    setFeedback(isPositive ? 'up' : 'down');
    onFeedback(messageId, isPositive);
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <button
        onClick={() => handleFeedback(true)}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
          feedback === 'up' ? 'text-green-500' : 'text-gray-400'
        }`}
        aria-label="Thumbs up"
      >
        <ThumbsUp size={16} />
      </button>
      <button
        onClick={() => handleFeedback(false)}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
          feedback === 'down' ? 'text-red-500' : 'text-gray-400'
        }`}
        aria-label="Thumbs down"
      >
        <ThumbsDown size={16} />
      </button>
    </div>
  );
};

export default FeedbackButtons;