// Keyboard shortcut handler

import { CONSTANTS } from '../utils/constants';

export class KeyboardHandler {
  private onNextTurn: (() => void) | null = null;
  private onPrevTurn: (() => void) | null = null;
  private onToggle: (() => void) | null = null;

  /**
   * Initialize keyboard shortcuts
   */
  init(handlers: {
    onNextTurn: () => void;
    onPrevTurn: () => void;
    onToggle: () => void;
  }): void {
    this.onNextTurn = handlers.onNextTurn;
    this.onPrevTurn = handlers.onPrevTurn;
    this.onToggle = handlers.onToggle;

    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    // Check if user is typing in an input field
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    // Ctrl/Cmd + Arrow keys for navigation
    if (event.ctrlKey || event.metaKey) {
      if (event.key === CONSTANTS.SHORTCUTS.NEXT_TURN) {
        event.preventDefault();
        this.onNextTurn?.();
      } else if (event.key === CONSTANTS.SHORTCUTS.PREV_TURN) {
        event.preventDefault();
        this.onPrevTurn?.();
      }
    }

    // Toggle navigator with 'n' key
    if (event.key === CONSTANTS.SHORTCUTS.TOGGLE_NAVIGATOR && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.onToggle?.();
    }
  };

  /**
   * Clean up event listeners
   */
  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
