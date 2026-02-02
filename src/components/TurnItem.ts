// Single conversation turn item component

import { ConversationTurn } from '../types';
import { CONSTANTS } from '../utils/constants';

export class TurnItem {
  private container: HTMLElement;
  private turn: ConversationTurn;
  private onClick: ((turnId: string) => void) | null = null;

  constructor(turn: ConversationTurn, index: number) {
    this.turn = turn;
    this.container = document.createElement('div');
    this.container.className = CONSTANTS.CLASSES.TURN_ITEM;
    this.container.setAttribute('data-turn-id', turn.id);

    // Create number indicator
    const number = document.createElement('span');
    number.className = 'ai-nav-turn-number';
    number.textContent = `#${index + 1}`;

    // Create content
    const content = document.createElement('div');
    content.className = 'ai-nav-turn-content';
    content.textContent = turn.userMessage;

    this.container.appendChild(number);
    this.container.appendChild(content);

    // Click handler
    this.container.addEventListener('click', () => {
      this.onClick?.(this.turn.id);
    });
  }

  setOnClick(callback: (turnId: string) => void): void {
    this.onClick = callback;
  }

  setActive(active: boolean): void {
    if (active) {
      this.container.classList.add(CONSTANTS.CLASSES.TURN_ACTIVE);
    } else {
      this.container.classList.remove(CONSTANTS.CLASSES.TURN_ACTIVE);
    }
  }

  getElement(): HTMLElement {
    return this.container;
  }

  getTurnId(): string {
    return this.turn.id;
  }
}
