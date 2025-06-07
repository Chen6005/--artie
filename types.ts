export enum Sender {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

export enum Language {
  ZH_TW = 'zh-TW',
  EN_US = 'en-US',
  JA_JP = 'ja-JP', // Added Japanese
}

export interface LocalizedContent {
  appTitle: string;
  artieWelcome: string;
  artieSystemInstruction: string;
  inputPlaceholder: string;
  inputPlaceholderLoading: string;
  sendButtonLabel: string;
  thinkingLabel: string;
  userLabel: string;
  artieLabel: string;
  errorPrefix: string;
  initializationError: (errorMsg: string) => string;
  communicationError: (errorMsg: string) => string;
  artieStartFailed: (errorMsg: string) => string;
  artieProblem: (errorMsg: string) => string;
  artieUnavailable: string;
  chatInitFailed: string;
  selectLanguageLabel: string;
  languageName: string;
}