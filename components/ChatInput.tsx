import React from 'react';

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  placeholder: string;
  sendButtonLabel: string;
}

const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const ChatInput: React.FC<ChatInputProps> = ({ inputValue, onInputChange, onSendMessage, isLoading, placeholder, sendButtonLabel }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
      event.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 bg-surface-input bg-opacity-80 backdrop-blur-sm border-t border-border-ui sticky bottom-0">
      <div className="flex items-center space-x-3">
        <textarea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-grow p-3 bg-surface-input-field text-text-content-primary rounded-xl border border-border-ui focus:ring-2 focus:ring-brand-accent focus:border-brand-accent resize-none transition-shadow duration-150 ease-in-out custom-scrollbar"
          rows={2}
          disabled={isLoading}
          aria-label={placeholder}
        />
        <button
          onClick={onSendMessage}
          disabled={isLoading || inputValue.trim() === ''}
          className="p-3 bg-brand-accent text-white rounded-xl hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 flex items-center justify-center h-[56px] w-[56px]"
          aria-label={sendButtonLabel}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <SendIcon />
          )}
        </button>
      </div>
       <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; /* border-ui / slate-300 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; /* gray-400 */
        }
      `}</style>
    </div>
  );
};

export default ChatInput;