import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Sender, Language, LocalizedContent } from './types';
import { initChat, sendMessageToGemini } from './services/geminiService';
import ChatMessageComponent from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { getLocaleStrings, AllLanguageOptions } from './localization';

const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.ZH_TW);
  const [localizedStrings, setLocalizedStrings] = useState<LocalizedContent>(getLocaleStrings(currentLanguage));
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatReady, setChatReady] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    // Title is set in index.html, but can be dynamically updated if needed
    // document.title = localizedStrings.appTitle; 
  }, [currentLanguage]);

   useEffect(() => {
    // Update localized strings whenever the language changes
    setLocalizedStrings(getLocaleStrings(currentLanguage));
  }, [currentLanguage]);


  const initializeConversation = useCallback(async (lang: Language) => {
    const strings = getLocaleStrings(lang);
    // No need to setLocalizedStrings here again as the above useEffect handles it
    setIsLoading(true);
    setError(null);
    setMessages([]); 
    setChatReady(false);

    try {
      await initChat(strings.artieSystemInstruction);
      setMessages([
        {
          id: 'artie-welcome',
          text: strings.artieWelcome,
          sender: Sender.AI,
          timestamp: new Date(),
        },
      ]);
      setChatReady(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown initialization error.";
      const displayError = strings.artieStartFailed(errorMsg);
      setError(displayError);
      setMessages([{
        id: 'init-error',
        text: displayError,
        sender: Sender.AI,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    initializeConversation(currentLanguage);
  }, [currentLanguage, initializeConversation]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLanguage(event.target.value as Language);
  };

  const handleSendMessage = useCallback(async () => {
    if (inputValue.trim() === '' || isLoading || !chatReady) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: Sender.USER,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInputValue = inputValue; 
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponseText = await sendMessageToGemini(currentInputValue, localizedStrings.artieSystemInstruction);
      
      let processedResponseText = aiResponseText;
      if (aiResponseText === "ARTIE_UNAVAILABLE_INIT_ERROR") {
        processedResponseText = localizedStrings.artieUnavailable;
      } else if (aiResponseText === "ARTIE_COMMUNICATION_ERROR") {
        processedResponseText = localizedStrings.communicationError("network or API issue");
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: processedResponseText,
        sender: Sender.AI,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (err) {
      const errorMessageText = err instanceof Error ? err.message : "Unknown communication error.";
      const displayError = localizedStrings.artieProblem(errorMessageText);
setError(displayError);
      const errorAiMessage: ChatMessage = {
        id: `ai-error-${Date.now()}`,
        text: displayError,
        sender: Sender.AI,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, chatReady, localizedStrings, setMessages, setInputValue, setIsLoading, setError]);
  
  const MuseumIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-accent">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
    </svg>
  );

  return (
    <div className="flex flex-col h-screen text-text-content-primary antialiased">
      <header className="p-4 bg-surface-header shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-border-ui">
        <div className="flex items-center space-x-3">
          <MuseumIcon />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-rose-500 to-amber-500">
            {localizedStrings.appTitle}
          </h1>
        </div>
        <div className="relative">
          <label htmlFor="language-select" className="sr-only">{localizedStrings.selectLanguageLabel}</label>
          <select 
            id="language-select"
            value={currentLanguage} 
            onChange={handleLanguageChange}
            className="bg-neutral-100 text-text-content-primary rounded-lg p-2 border border-border-ui focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
            aria-label={localizedStrings.selectLanguageLabel}
          >
            {AllLanguageOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </header>
      
      <div 
        ref={chatContainerRef} 
        className="flex-grow p-4 md:p-6 space-y-4 overflow-y-auto custom-scrollbar"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {messages.map((msg) => (
          <ChatMessageComponent 
            key={msg.id} 
            message={msg} 
            userLabel={localizedStrings.userLabel}
            artieLabel={localizedStrings.artieLabel}
          />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length -1].sender === Sender.USER && (
          <div className="flex justify-start mb-4" aria-label={`${localizedStrings.artieLabel} ${localizedStrings.thinkingLabel}`}>
            <div className="flex items-end max-w-3/4 md:max-w-2/3">
               <div className="mx-2">
                <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-text-on-secondary font-bold text-lg shadow-md">A</div>
              </div>
              <div className="p-3 rounded-2xl shadow-md bg-brand-secondary text-text-on-secondary">
                <p className="text-sm font-medium mb-1">{localizedStrings.artieLabel}</p>
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-thinking-dots rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-thinking-dots rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-thinking-dots rounded-full animate-pulse delay-200"></div>
                  <span className="text-sm text-text-on-secondary ml-1">{localizedStrings.thinkingLabel}</span> {/* Adjusted text color for thinking label */}
                </div>
              </div>
            </div>
          </div>
        )}
         {isLoading && messages.length === 0 && ( 
          <div className="flex justify-center items-center h-full" aria-label={localizedStrings.thinkingLabel}>
             <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-brand-accent mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-text-content-secondary">{localizedStrings.thinkingLabel}</p>
              </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-error-bg text-error-text border border-error-border text-sm text-center rounded-md mx-4 mb-2" role="alert">
          {localizedStrings.errorPrefix}: {error}
        </div>
      )}

      <ChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        isLoading={isLoading || !chatReady}
        placeholder={isLoading ? localizedStrings.inputPlaceholderLoading : localizedStrings.inputPlaceholder}
        sendButtonLabel={localizedStrings.sendButtonLabel}
      />
       <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a3a3a3; /* neutral-400 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #737373; /* neutral-500 */
        }
      `}</style>
    </div>
  );
};

export default App;