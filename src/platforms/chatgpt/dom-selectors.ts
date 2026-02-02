// DOM selectors for ChatGPT
// These may need to be updated if ChatGPT changes its DOM structure

export const SELECTORS = {
  // Main conversation container
  conversationContainer: 'main',

  // User and AI message containers - multiple strategies for robustness
  messageGroups: [
    '[data-testid^="conversation-turn"]',
    'div[class*="group"]',
    'article',
  ],

  // User message indicators
  userMessageIndicators: [
    '[data-message-author-role="user"]',
    'div[class*="whitespace-pre-wrap"]',
  ],

  // AI response indicators
  aiMessageIndicators: [
    '[data-message-author-role="assistant"]',
    'div[class*="markdown"]',
  ],
};

/**
 * Find user message element using multiple strategies
 */
export function findUserMessage(container: HTMLElement): HTMLElement | null {
  for (const selector of SELECTORS.userMessageIndicators) {
    const element = container.querySelector(selector) as HTMLElement;
    if (element) return element;
  }
  return null;
}

/**
 * Find AI message element using multiple strategies
 */
export function findAIMessage(container: HTMLElement): HTMLElement | null {
  for (const selector of SELECTORS.aiMessageIndicators) {
    const element = container.querySelector(selector) as HTMLElement;
    if (element) return element;
  }
  return null;
}
