/**
 * Google Gemini Platform Adapter
 * TODO: Requires actual testing on Gemini to verify DOM structure
 */
class GeminiAdapter extends PlatformAdapter {
  constructor() {
    super();
    this.name = 'Gemini';
  }

  getMessageSelectors() {
    // TODO: Verify these selectors with actual Gemini DOM structure
    return [
      '.user-query',
      '[data-message-role="user"]',
      '.message[data-author="user"]'
    ];
  }

  isUserMessage(element) {
    // TODO: Adjust based on actual DOM structure
    return element.classList.contains('user-query') ||
           element.dataset?.messageRole === 'user' ||
           element.dataset?.author === 'user';
  }

  shouldReinitialize(oldUrl, newUrl) {
    try {
      const oldPath = new URL(oldUrl).pathname;
      const newPath = new URL(newUrl).pathname;

      // TODO: Verify Gemini's conversation URL pattern
      return oldPath !== newPath;
    } catch (e) {
      return oldUrl !== newUrl;
    }
  }

  getExpandButtonInsertionPoints() {
    return [
      // TODO: Find the best insertion point for Gemini UI
      { selector: 'header', insertMethod: 'append' },
      { selector: 'body', insertMethod: 'append' }
    ];
  }
}
