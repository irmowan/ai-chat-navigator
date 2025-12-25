/**
 * ChatGPT Platform Adapter
 * Handles ChatGPT-specific DOM structure and behavior
 */
class ChatGPTAdapter extends PlatformAdapter {
  constructor() {
    super();
    this.name = 'ChatGPT';
  }

  getMessageSelectors() {
    return [
      '[data-message-author-role="user"]',
      '.text-message[data-message-author-role="user"]',
      'div[data-testid^="conversation-turn"] [data-message-author-role="user"]',
      '.agent-turn .whitespace-pre-wrap'
    ];
  }

  isUserMessage(element) {
    return element.hasAttribute?.('data-message-author-role') &&
           element.getAttribute('data-message-author-role') === 'user';
  }

  shouldReinitialize(oldUrl, newUrl) {
    try {
      const oldPath = new URL(oldUrl).pathname;
      const newPath = new URL(newUrl).pathname;

      // ChatGPT conversation URL format: /c/{conversation_id}
      const isChatPath = (path) => path.startsWith('/c/');

      return isChatPath(oldPath) && isChatPath(newPath) && oldPath !== newPath;
    } catch (e) {
      return oldUrl !== newUrl;
    }
  }

  getConversationId() {
    const match = window.location.pathname.match(/\/c\/([^\/]+)/);
    return match ? match[1] : null;
  }

  getExpandButtonInsertionPoints() {
    return [
      // Priority: insert into top-right toolbar
      { selector: 'header nav', insertMethod: 'append' },
      // Fallback: main header
      { selector: 'header', insertMethod: 'append' },
      // Degraded: body
      { selector: 'body', insertMethod: 'append' }
    ];
  }

  getCustomStyles() {
    // ChatGPT specific style adjustments if needed
    return '';
  }
}
