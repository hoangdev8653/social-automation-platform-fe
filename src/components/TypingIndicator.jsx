// Component cho hiệu ứng "đang gõ"
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="px-4 py-3 rounded-xl max-w-[70%] bg-gray-100 text-gray-800 flex items-center gap-1.5">
      <style>
        {`
          .typing-dot {
            width: 8px;
            height: 8px;
            background-color: #9ca3af;
            border-radius: 50%;
            animation: typing 1s infinite ease-in-out;
          }
          .typing-dot:nth-of-type(2) { animation-delay: 0.15s; }
          .typing-dot:nth-of-type(3) { animation-delay: 0.3s; }
          @keyframes typing { 0%, 100% { opacity: 0.3; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1); } }
        `}
      </style>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  </div>
);

export default TypingIndicator;
