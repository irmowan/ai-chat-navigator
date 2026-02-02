// Core type definitions for the AI Turn Navigator

export interface ConversationTurn {
  id: string;
  userMessage: string;
  userMessageElement: HTMLElement;
  aiMessageElement?: HTMLElement;
  timestamp?: Date;
}

export interface NavigatorState {
  isExpanded: boolean;
  currentTurnId: string | null;
  searchQuery: string;
}

export interface StorageData {
  navigatorState: NavigatorState;
}
