// Copilot platform adapter (placeholder for future implementation)

import { PlatformAdapter } from '../base/PlatformAdapter';
import { ConversationTurn } from '../../types';

export class CopilotAdapter extends PlatformAdapter {
  getPlatformName(): string {
    return 'Copilot';
  }

  isCurrentPlatform(): boolean {
    return window.location.hostname.includes('copilot.microsoft.com');
  }

  parseConversations(): ConversationTurn[] {
    // TODO: Implement Copilot DOM parsing
    console.warn('[AI Navigator] Copilot adapter not yet implemented');
    return [];
  }

  observeNewMessages(_callback: (turns: ConversationTurn[]) => void): void {
    // TODO: Implement Copilot message observation
    console.warn('[AI Navigator] Copilot observer not yet implemented');
  }

  getConversationContainer(): HTMLElement | null {
    // TODO: Implement Copilot container detection
    return null;
  }
}
