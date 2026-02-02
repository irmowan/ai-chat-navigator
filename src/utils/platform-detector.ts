// Platform detection utility

import { PlatformAdapter } from '../platforms/base/PlatformAdapter';
import { ChatGPTAdapter } from '../platforms/chatgpt/ChatGPTAdapter';
import { GeminiAdapter } from '../platforms/gemini/GeminiAdapter';
import { CopilotAdapter } from '../platforms/copilot/CopilotAdapter';

/**
 * Detect which AI platform is currently active
 * @returns The appropriate PlatformAdapter or null if no platform detected
 */
export function detectPlatform(): PlatformAdapter | null {
  const adapters: PlatformAdapter[] = [
    new ChatGPTAdapter(),
    new GeminiAdapter(),
    new CopilotAdapter(),
  ];

  const adapter = adapters.find(adapter => adapter.isCurrentPlatform());

  if (adapter) {
    console.log(`[AI Navigator] Detected platform: ${adapter.getPlatformName()}`);
  } else {
    console.warn('[AI Navigator] No supported platform detected');
  }

  return adapter || null;
}
