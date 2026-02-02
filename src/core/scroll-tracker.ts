// Scroll tracking and automatic positioning

import { ConversationTurn } from '../types';

export class ScrollTracker {
  private observer: IntersectionObserver | null = null;
  private currentTurnId: string | null = null;
  private onTurnChange: ((turnId: string) => void) | null = null;

  /**
   * Start tracking scroll position
   */
  startTracking(
    turns: ConversationTurn[],
    onTurnChange: (turnId: string) => void
  ): void {
    this.onTurnChange = onTurnChange;

    // Disconnect existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // Find the most visible entry
        let mostVisible: IntersectionObserverEntry | undefined;
        let maxRatio = 0;

        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            mostVisible = entry;
            maxRatio = entry.intersectionRatio;
          }
        });

        // Update current turn if we found a visible element
        if (mostVisible) {
          const element = mostVisible.target as HTMLElement;
          const turnId = element.getAttribute('data-turn-id');
          if (turnId && turnId !== this.currentTurnId) {
            this.currentTurnId = turnId;
            this.onTurnChange?.(turnId);
          }
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '-20% 0px -20% 0px', // Focus on center of viewport
      }
    );

    // Observe all turn elements
    turns.forEach(turn => {
      turn.userMessageElement.setAttribute('data-turn-id', turn.id);
      this.observer?.observe(turn.userMessageElement);
    });
  }

  /**
   * Stop tracking
   */
  stopTracking(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Get current turn ID
   */
  getCurrentTurnId(): string | null {
    return this.currentTurnId;
  }
}
