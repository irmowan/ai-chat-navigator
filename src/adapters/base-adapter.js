/**
 * Platform Adapter Base Class
 * All platform adapters should extend this class and implement required methods
 */
class PlatformAdapter {
  constructor() {
    this.name = 'base';
  }

  // ==================== Message Detection ====================

  /**
   * Get CSS selectors for finding user messages (in priority order)
   * @returns {string[]} Array of selectors
   */
  getMessageSelectors() {
    throw new Error('Must implement getMessageSelectors()');
  }

  /**
   * Check if the given element is a user message
   * @param {Element} element - DOM element
   * @returns {boolean}
   */
  isUserMessage(element) {
    throw new Error('Must implement isUserMessage()');
  }

  /**
   * Extract text content from message element
   * @param {Element} element - Message element
   * @returns {string} Extracted text
   */
  extractMessageText(element) {
    // Default implementation, can be overridden by subclasses
    const clone = element.cloneNode(true);

    // Remove unwanted elements
    const elementsToRemove = this.getElementsToRemoveFromText();
    const toRemove = clone.querySelectorAll(elementsToRemove.join(', '));
    toRemove.forEach(el => el.remove());

    let text = clone.textContent.trim();

    // Apply max length limit
    const maxLength = this.getMaxTextLength();
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }

    return text;
  }

  /**
   * Get selectors for elements to remove from text
   * @returns {string[]}
   */
  getElementsToRemoveFromText() {
    return ['button', 'svg', 'img', '[role="button"]'];
  }

  /**
   * Get maximum text length
   * @returns {number}
   */
  getMaxTextLength() {
    return 100;
  }

  // ==================== DOM Observation ====================

  /**
   * Get target element for MutationObserver
   * @returns {Element}
   */
  getObserverTarget() {
    return document.body;
  }

  /**
   * Get MutationObserver configuration
   * @returns {MutationObserverInit}
   */
  getObserverConfig() {
    return {
      childList: true,
      subtree: true,
      attributes: false
    };
  }

  /**
   * Find user messages in newly added node
   * @param {Node} node - Added node
   * @returns {Element[]} Array of found user message elements
   */
  findUserMessagesInNode(node) {
    const messages = [];

    if (node.nodeType === Node.ELEMENT_NODE) {
      // Check the node itself
      if (this.isUserMessage(node)) {
        messages.push(node);
      }

      // Search in children
      const selectors = this.getMessageSelectors();
      for (const selector of selectors) {
        const found = node.querySelectorAll?.(selector);
        if (found && found.length > 0) {
          messages.push(...Array.from(found));
          break;
        }
      }
    }

    return messages;
  }

  // ==================== URL and Conversation Switching ====================

  /**
   * Check if URL change requires reinitialization
   * @param {string} oldUrl - Old URL
   * @param {string} newUrl - New URL
   * @returns {boolean}
   */
  shouldReinitialize(oldUrl, newUrl) {
    // Default: reinitialize when path changes
    try {
      const oldPath = new URL(oldUrl).pathname;
      const newPath = new URL(newUrl).pathname;
      return oldPath !== newPath;
    } catch (e) {
      return oldUrl !== newUrl;
    }
  }

  /**
   * Get conversation ID (for distinguishing different conversations)
   * @returns {string|null}
   */
  getConversationId() {
    // Default: extract from URL
    const match = window.location.pathname.match(/\/c\/([^\/]+)/);
    return match ? match[1] : null;
  }

  // ==================== UI Related ====================

  /**
   * Get sidebar insertion point
   * @returns {Element}
   */
  getSidebarInsertionPoint() {
    return document.body;
  }

  /**
   * Get expand button insertion points (multiple candidates, in priority order)
   * @returns {Array<{selector: string, insertMethod: 'append'|'prepend'|'before'|'after'}>}
   */
  getExpandButtonInsertionPoints() {
    return [
      { selector: 'body', insertMethod: 'append' }
    ];
  }

  /**
   * Platform-specific custom styles
   * @returns {string} CSS string
   */
  getCustomStyles() {
    return '';
  }

  // ==================== Helper Methods ====================

  /**
   * Get initialization delay in milliseconds
   * Some platforms need to wait for DOM to be ready
   * @returns {number}
   */
  getInitializationDelay() {
    return 1000;
  }

  /**
   * Get scan delay after conversation switch (milliseconds)
   * @returns {number}
   */
  getConversationSwitchDelay() {
    return 500;
  }

  /**
   * Get URL polling interval (milliseconds)
   * @returns {number}
   */
  getUrlPollingInterval() {
    return 1000;
  }

  /**
   * Get platform name (for logging)
   * @returns {string}
   */
  getPlatformName() {
    return this.name;
  }

  /**
   * Get log prefix
   * @returns {string}
   */
  getLogPrefix() {
    return `[AI Chat Navigator - ${this.getPlatformName()}]`;
  }
}
