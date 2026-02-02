// ChatGPT platform adapter implementation

import { PlatformAdapter } from '../base/PlatformAdapter';
import { ConversationTurn } from '../../types';
import { SELECTORS, findUserMessage, findAIMessage } from './dom-selectors';

export class ChatGPTAdapter extends PlatformAdapter {
  private observer: MutationObserver | null = null;

  getPlatformName(): string {
    return 'ChatGPT';
  }

  isCurrentPlatform(): boolean {
    return window.location.hostname.includes('chatgpt.com') ||
           window.location.hostname.includes('chat.openai.com');
  }

  parseConversations(): ConversationTurn[] {
    const turns: ConversationTurn[] = [];
    const container = this.getConversationContainer();

    if (!container) {
      console.warn('[AI Navigator] Conversation container not found');
      return turns;
    }

    // Try different selectors to find message groups
    let messageElements: HTMLElement[] = [];

    for (const selector of SELECTORS.messageGroups) {
      const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
      if (elements.length > 0) {
        messageElements = elements;
        break;
      }
    }

    if (messageElements.length === 0) {
      console.warn('[AI Navigator] No message elements found');
      return turns;
    }

    // Parse each message group - only include elements with actual conversation data
    messageElements.forEach((element, index) => {
      const userMessageEl = findUserMessage(element);

      // Must have user role attribute to be a real conversation turn
      const hasUserRole = element.querySelector('[data-message-author-role="user"]');

      if (userMessageEl && hasUserRole) {
        const messageText = userMessageEl.textContent?.trim() || '';

        if (messageText) {
          const turn: ConversationTurn = {
            id: this.generateTurnId(index, messageText),
            userMessage: this.extractPreview(messageText),
            userMessageElement: element,
            aiMessageElement: findAIMessage(element) || undefined,
          };

          turns.push(turn);
        }
      }
    });

    console.log(`[AI Navigator] Parsed ${turns.length} conversation turns`);
    return turns;
  }

  observeNewMessages(callback: (turns: ConversationTurn[]) => void): void {
    const container = this.getConversationContainer();

    if (!container) {
      console.warn('[AI Navigator] Cannot observe: container not found');
      return;
    }

    // Disconnect existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Create new observer
    this.observer = new MutationObserver((mutations) => {
      // Check if any mutations added new elements
      const hasNewElements = mutations.some(mutation =>
        mutation.addedNodes.length > 0
      );

      if (hasNewElements) {
        // Debounce: wait a bit for ChatGPT to finish rendering
        setTimeout(() => {
          const turns = this.parseConversations();
          callback(turns);
        }, 500);
      }
    });

    // Start observing
    this.observer.observe(container, {
      childList: true,
      subtree: true,
    });

    console.log('[AI Navigator] Started observing DOM changes');
  }

  getConversationContainer(): HTMLElement | null {
    return document.querySelector(SELECTORS.conversationContainer);
  }

  /**
   * Disconnect the observer when cleaning up
   */
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
