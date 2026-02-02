// Core navigator logic (platform-agnostic)

import { ConversationTurn } from '../types';
import { PlatformAdapter } from '../platforms/base/PlatformAdapter';
import { ScrollTracker } from './scroll-tracker';
import { KeyboardHandler } from './keyboard-handler';

export class Navigator {
  private adapter: PlatformAdapter;
  private scrollTracker: ScrollTracker;
  private keyboardHandler: KeyboardHandler;
  private turns: ConversationTurn[] = [];
  private currentIndex: number = 0;
  private onTurnsUpdate: ((turns: ConversationTurn[]) => void) | null = null;
  private onCurrentTurnChange: ((turnId: string) => void) | null = null;

  constructor(adapter: PlatformAdapter) {
    this.adapter = adapter;
    this.scrollTracker = new ScrollTracker();
    this.keyboardHandler = new KeyboardHandler();
  }

  /**
   * Initialize the navigator
   */
  init(handlers: {
    onTurnsUpdate: (turns: ConversationTurn[]) => void;
    onCurrentTurnChange: (turnId: string) => void;
    onToggle: () => void;
  }): void {
    this.onTurnsUpdate = handlers.onTurnsUpdate;
    this.onCurrentTurnChange = handlers.onCurrentTurnChange;

    // Parse initial conversations
    this.updateTurns();

    // Start observing new messages
    this.adapter.observeNewMessages(() => {
      this.updateTurns();
    });

    // Initialize keyboard shortcuts
    this.keyboardHandler.init({
      onNextTurn: () => this.navigateToNext(),
      onPrevTurn: () => this.navigateToPrevious(),
      onToggle: handlers.onToggle,
    });

    // Start scroll tracking
    this.scrollTracker.startTracking(this.turns, (turnId) => {
      this.onCurrentTurnChange?.(turnId);
    });
  }

  /**
   * Update conversation turns
   */
  private updateTurns(): void {
    this.turns = this.adapter.parseConversations();
    this.onTurnsUpdate?.(this.turns);

    // Restart scroll tracking with new turns
    this.scrollTracker.startTracking(this.turns, (turnId) => {
      this.onCurrentTurnChange?.(turnId);
    });
  }

  /**
   * Refresh conversations (public method for URL changes)
   */
  refreshConversations(): void {
    this.updateTurns();
  }

  /**
   * Navigate to a specific turn
   */
  navigateToTurn(turnId: string): void {
    const turn = this.turns.find(t => t.id === turnId);
    if (turn) {
      this.adapter.scrollToElement(turn.userMessageElement);
      this.adapter.highlightMessage(turn.userMessageElement);
      this.currentIndex = this.turns.indexOf(turn);
    }
  }

  /**
   * Navigate to next turn
   */
  navigateToNext(): void {
    if (this.currentIndex < this.turns.length - 1) {
      this.currentIndex++;
      const turn = this.turns[this.currentIndex];
      this.navigateToTurn(turn.id);
    }
  }

  /**
   * Navigate to previous turn
   */
  navigateToPrevious(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const turn = this.turns[this.currentIndex];
      this.navigateToTurn(turn.id);
    }
  }

  /**
   * Filter turns by search query
   */
  filterTurns(query: string): ConversationTurn[] {
    if (!query.trim()) {
      return this.turns;
    }

    const lowerQuery = query.toLowerCase();
    return this.turns.filter(turn =>
      turn.userMessage.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get all turns
   */
  getTurns(): ConversationTurn[] {
    return this.turns;
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.scrollTracker.stopTracking();
    this.keyboardHandler.destroy();
  }
}
