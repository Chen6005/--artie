import React from 'react';
import { ChatMessage, Sender } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
  userLabel: string;
  artieLabel: string;
}

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-brand-primary">
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438Z" clipRule="evenodd" />
  </svg>
);

const AiIcon: React.FC = () => (
 <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-text-on-secondary font-bold text-lg shadow-md">
    A
  </div>
);


const ChatMessageComponent: React.FC<ChatMessageProps> = React.memo(({ message, userLabel, artieLabel }) => {
  const isUser = message.sender === Sender.USER;
  const alignment = isUser ? 'justify-end' : 'justify-start';
  const bgColor = isUser ? 'bg-brand-primary' : 'bg-brand-secondary';
  const textColor = isUser ? 'text-text-on-primary' : 'text-text-on-secondary';
  const textAlign = isUser ? 'text-right' : 'text-left';
  // Adjusted timestamp colors for better contrast on new bubble backgrounds
  const timestampColor = isUser ? 'text-sky-700' : 'text-violet-200'; // Changed for AI bubble


  const formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${alignment} mb-4 w-full`} role="article" aria-labelledby={`message-sender-${message.id}`}>
      <div className={`flex items-end max-w-3/4 md:max-w-2/3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="mx-2 self-start mt-1"> {/* Align icons to the top of the bubble */}
          {isUser ? <UserIcon /> : <AiIcon />}
        </div>
        <div className={`p-3 rounded-2xl shadow-md ${bgColor} ${textColor}`}>
          <p className="text-sm font-semibold mb-1" id={`message-sender-${message.id}`}> {/* Slightly bolder sender label */}
            {isUser ? userLabel : artieLabel}
          </p>
          <p className="whitespace-pre-wrap text-base break-words">{message.text}</p>
          <p className={`text-xs ${timestampColor} mt-1 ${textAlign}`}>
            {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
});

export default ChatMessageComponent;