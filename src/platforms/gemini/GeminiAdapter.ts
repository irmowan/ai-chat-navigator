// Gemini platform adapter (placeholder for future implementation)

import { PlatformAdapter } from '../base/PlatformAdapter';
import { ConversationTurn } from '../../types';

export class GeminiAdapter extends PlatformAdapter {
  getPlatformName(): string {
    return 'Gemini';
  }

  isCurrentPlatform(): boolean {
    return window.location.hostname.includes('gemini.google.com');
  }

  parseConversations(): ConversationTurn[] {
    // TODO: Implement Gemini DOM parsing
    console.warn('[AI Navigator] Gemini adapter not yet implemented');
    return [];
  }

  observeNewMessages(_callback: (turns: ConversationTurn[]) => void): void {
    // TODO: Implement Gemini message observation
    console.warn('[AI Navigator] Gemini observer not yet implemented');
  }

  getConversationContainer(): HTMLElement | null {
    // TODO: Implement Gemini container detection
    return null;
  }
}
