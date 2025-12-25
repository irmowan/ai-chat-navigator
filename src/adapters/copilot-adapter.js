/**
 * Microsoft Copilot Platform Adapter
 * Supports: copilot.microsoft.com, m365.cloud.microsoft, copilot.cloud.microsoft
 */
class CopilotAdapter extends PlatformAdapter {
  constructor() {
    super();
    this.name = 'Copilot';
  }

  getMessageSelectors() {
    return [
      // User messages are article elements with UserMessage class
      '[role="article"][class*="UserMessage"]'
    ];
  }

  isUserMessage(element) {
    // Check for fai-UserMessage class using classList
    if (element.classList && element.classList.contains('fai-UserMessage')) {
      return true;
    }

    // Fallback: check className as string
    const classNameStr = element.className?.toString() || '';
    if (classNameStr.includes('fai-UserMessage') || classNameStr.includes('UserMessage')) {
      return true;
    }

    // Check role and class combination
    if (element.getAttribute('role') === 'article' && classNameStr.includes('UserMessage')) {
      return true;
    }

    // Additional check: aria-labelledby contains "user-message"
    const ariaLabel = element.getAttribute('aria-labelledby');
    if (ariaLabel && ariaLabel.includes('user-message')) {
      return true;
    }

    return false;
  }

  shouldReinitialize(oldUrl, newUrl) {
    try {
      // Copilot uses query parameters for conversation tracking
      const oldParams = new URL(oldUrl).searchParams;
      const newParams = new URL(newUrl).searchParams;

      // Check if conversation context changed
      const oldContext = oldParams.get('internalredirect') || oldParams.get('chatId');
      const newContext = newParams.get('internalredirect') || newParams.get('chatId');

      // Also check pathname changes
      const oldPath = new URL(oldUrl).pathname;
      const newPath = new URL(newUrl).pathname;

      return oldPath !== newPath || oldContext !== newContext;
    } catch (e) {
      return oldUrl !== newUrl;
    }
  }

  getConversationId() {
    // Try to extract conversation ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    return params.get('chatId') || params.get('internalredirect') || null;
  }

  getExpandButtonInsertionPoints() {
    return [
      // Try Copilot's top-right header area (priority)
      { selector: 'header div[class*="right"]', insertMethod: 'append' },
      { selector: 'header div[class*="Right"]', insertMethod: 'append' },
      // Try any header button container
      { selector: 'header div[class*="controls"]', insertMethod: 'append' },
      { selector: 'header div[class*="Controls"]', insertMethod: 'append' },
      // Try navigation area
      { selector: 'nav', insertMethod: 'append' },
      // Try header directly
      { selector: 'header', insertMethod: 'append' },
      // Fallback to body
      { selector: 'body', insertMethod: 'append' }
    ];
  }

  getInitializationDelay() {
    // Copilot may need more time to load
    return 1500;
  }

  getConversationSwitchDelay() {
    // Allow more time for conversation switching
    return 800;
  }

  getCustomStyles() {
    // Copilot-specific styles - higher z-index and force positioning
    return `
      .ctn-sidebar {
        position: fixed !important;
        top: 0 !important;
        right: 0 !important;
        left: auto !important;
        bottom: auto !important;
        z-index: 999999 !important;
        transform: translateX(0) !important;
      }
      .ctn-sidebar.ctn-hidden {
        transform: translateX(100%) !important;
      }
      /* Expand button - always fixed position on right side */
      .ctn-expand-btn-container {
        position: fixed !important;
        top: 50% !important;
        right: 0 !important;
        transform: translateY(-50%) !important;
        z-index: 999998 !important;
      }
      .ctn-expand-btn {
        position: relative !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 24px !important;
        height: 48px !important;
        background: #fff !important;
        border: 1px solid #e5e5e5 !important;
        border-right: none !important;
        border-radius: 8px 0 0 8px !important;
        cursor: pointer !important;
        opacity: 1 !important;
        visibility: visible !important;
        box-shadow: -2px 0 8px rgba(0,0,0,0.1) !important;
      }
      .ctn-expand-btn:hover {
        background: #f5f5f5 !important;
      }
      .ctn-expand-btn.ctn-hidden {
        display: none !important;
      }
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .ctn-expand-btn {
          background: #2d2d2d !important;
          border-color: #3d3d3d !important;
          color: #fff !important;
        }
        .ctn-expand-btn:hover {
          background: #3d3d3d !important;
        }
      }
    `;
  }
}
