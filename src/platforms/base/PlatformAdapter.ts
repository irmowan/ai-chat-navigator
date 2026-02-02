// Abstract base class for platform adapters (Strategy Pattern)

import { ConversationTurn } from '../../types';

export abstract class PlatformAdapter {
  /**
   * Get the platform name (e.g., "ChatGPT", "Gemini")
   */
  abstract getPlatformName(): string;

  /**
   * Check if the current page matches this platform
   */
  abstract isCurrentPlatform(): boolean;

  /**
   * Parse conversation turns from the DOM
   */
  abstract parseConversations(): ConversationTurn[];

  /**
   * Observe new messages and call the callback when changes occur
   */
  abstract observeNewMessages(callback: (turns: ConversationTurn[]) => void): void;

  /**
   * Get the main conversation container element
   */
  abstract getConversationContainer(): HTMLElement | null;

  /**
   * Highlight a specific message element
   */
  highlightMessage(element: HTMLElement): void {
    // Remove existing highlights
    document.querySelectorAll('.ai-nav-highlight').forEach(el => {
      el.classList.remove('ai-nav-highlight');
    });

    // Add highlight class
    element.classList.add('ai-nav-highlight');

    // Remove highlight after 2 seconds
    setTimeout(() => {
      element.classList.remove('ai-nav-highlight');
    }, 2000);
  }

  /**
   * Scroll to a specific element smoothly
   */
  scrollToElement(element: HTMLElement): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  /**
   * Generate a unique ID for a conversation turn
   */
  protected generateTurnId(index: number, text: string): string {
    return `turn-${index}-${text.substring(0, 20).replace(/\s/g, '-')}`;
  }

  /**
   * Extract preview text (first 50 characters)
   */
  protected extractPreview(text: string): string {
    return text.trim().substring(0, 50) + (text.length > 50 ? '...' : '');
  }
}
