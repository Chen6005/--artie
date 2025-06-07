import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAiInstance = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const initChat = async (systemInstruction: string): Promise<void> => {
  try {
    const currentAi = getAiInstance();
    chatSession = currentAi.chats.create({
      model: GEMINI_MODEL_NAME,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    console.log("Chat session initialized successfully with Artie using provided system instruction.");
  } catch (error) {
    console.error("Failed to initialize chat session:", error);
    chatSession = null; // Ensure chatSession is null on failure
    // Throw a more generic error or the original one, App.tsx will handle user-facing localized message
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to initialize chat session due to an unknown error.");
  }
};

export const sendMessageToGemini = async (message: string, systemInstructionForReinit: string): Promise<string> => {
  if (!chatSession) {
    try {
      // Pass the potentially new system instruction if re-initialization is needed
      await initChat(systemInstructionForReinit);
      if (!chatSession) { // Double check after init attempt
         throw new Error("Chat session failed to initialize and is still null after attempt.");
      }
    } catch (initError) {
      console.error("Re-initialization failed during send message:", initError);
      // This specific error message will be overridden by a localized one in App.tsx
      return "ARTIE_UNAVAILABLE_INIT_ERROR";
    }
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    
    // Attempt to re-initialize chat for next message if it's a connection type error
    // This is a simple re-init, more sophisticated error handling might be needed
    if (error instanceof Error && (error.message.includes('NetworkError') || error.message.includes('API key') || error.message.includes('Chat session failed to initialize'))) {
        chatSession = null; // Force re-initialization on next call
    }
    // This specific error message will be overridden by a localized one in App.tsx
    return "ARTIE_COMMUNICATION_ERROR";
  }
};
