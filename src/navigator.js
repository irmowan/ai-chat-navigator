// Core navigation logic module

class Navigator {
  constructor(i18n, sidebar) {
    this.i18n = i18n;
    this.sidebar = sidebar;
    this.queries = [];
    this.observer = null;
    this.currentActiveIndex = -1;
    this.currentConversationUrl = window.location.href;
  }

  // Initialize navigator
  init() {
    console.log('[ChatGPT Turn Navigator] Initializing...');

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  // Start navigation system
  start() {
    setTimeout(() => {
      this.sidebar.create();
      this.sidebar.restoreState();
      
      // Setup sidebar callbacks
      this.sidebar.onItemClick = (index) => this.scrollToQuery(index);
      this.sidebar.onSearch = (term) => this.sidebar.filter(term);

      this.scanExistingQueries();
      this.startObserving();
      this.setupScrollListener();
      this.setupUrlChangeDetection();
      
      console.log('[ChatGPT Turn Navigator] Started successfully');
    }, 1000);
  }

  // Scan existing queries on page
  scanExistingQueries() {
    const selectors = [
      '[data-message-author-role="user"]',
      '.text-message[data-message-author-role="user"]',
      'div[data-testid^="conversation-turn"] [data-message-author-role="user"]',
      '.agent-turn .whitespace-pre-wrap',
    ];

    let userMessages = [];
    for (const selector of selectors) {
      userMessages = document.querySelectorAll(selector);
      if (userMessages.length > 0) {
        console.log(`[ChatGPT Turn Navigator] Found ${userMessages.length} ${this.i18n.getText('found')}`);
        break;
      }
    }

    if (userMessages.length === 0) {
      const allMessages = document.querySelectorAll('article, [class*="message"], [class*="turn"]');
      userMessages = Array.from(allMessages).filter(msg => {
        const text = msg.textContent.trim();
        return text.length > 0 && !msg.querySelector('[class*="assistant"]');
      });
      console.log(`[ChatGPT Turn Navigator] Found ${userMessages.length} ${this.i18n.getText('foundFallback')}`);
    }

    userMessages.forEach((element, index) => {
      this.addQuery(element, index);
    });

    this.sidebar.update(this.queries);
  }

  // Add query to list
  addQuery(element, index = null) {
    const textContent = this.extractTextContent(element);

    if (!textContent || textContent.length < 2) {
      return;
    }

    const exists = this.queries.some(q => q.text === textContent);
    if (exists) {
      return;
    }

    const query = {
      index: index !== null ? index : this.queries.length,
      text: textContent,
      element: element,
      timestamp: new Date()
    };

    this.queries.push(query);
    console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('added')} #${query.index + 1}: ${textContent.substring(0, 50)}...`);
  }

  // Extract text content from element
  extractTextContent(element) {
    const clone = element.cloneNode(true);
    const toRemove = clone.querySelectorAll('button, svg, img, [role="button"]');
    toRemove.forEach(el => el.remove());

    let text = clone.textContent.trim();
    const maxLength = 100;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
    }

    return text;
  }

  // Start observing DOM changes
  startObserving() {
    const config = {
      childList: true,
      subtree: true,
      attributes: false
    };

    this.observer = new MutationObserver((mutations) => {
      let hasNewMessages = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (this.isUserMessage(node)) {
              this.addQuery(node);
              hasNewMessages = true;
            }

            const userMessages = node.querySelectorAll?.('[data-message-author-role="user"]');
            if (userMessages && userMessages.length > 0) {
              userMessages.forEach(msg => this.addQuery(msg));
              hasNewMessages = true;
            }
          }
        });
      });

      if (hasNewMessages) {
        this.sidebar.update(this.queries);
      }
    });

    this.observer.observe(document.body, config);
    console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('observerStarted')}`);
  }

  // Check if element is a user message
  isUserMessage(element) {
    return element.hasAttribute?.('data-message-author-role') &&
           element.getAttribute('data-message-author-role') === 'user';
  }

  // Scroll to specific query
  scrollToQuery(index) {
    const query = this.queries[index];
    if (!query || !query.element) {
      console.warn(`[ChatGPT Turn Navigator] ${this.i18n.getText('notFound')} #${index + 1} ${this.i18n.getText('notFoundSuffix')}`);
      return;
    }

    this.highlightElement(query.element);

    query.element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });

    this.sidebar.updateActiveItem(index);
    this.currentActiveIndex = index;

    console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('scrolled')} #${index + 1}`);
  }

  // Highlight element temporarily
  highlightElement(element) {
    document.querySelectorAll('.ctn-highlight').forEach(el => {
      el.classList.remove('ctn-highlight');
    });

    element.classList.add('ctn-highlight');

    setTimeout(() => {
      element.classList.remove('ctn-highlight');
    }, 3000);
  }

  // Setup scroll listener to track current position
  setupScrollListener() {
    let scrollTimeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.updateCurrentPosition();
      }, 150);
    }, { passive: true });
  }

  // Update current position based on scroll
  updateCurrentPosition() {
    if (this.queries.length === 0) {
      return;
    }

    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    this.queries.forEach((query, index) => {
      if (query.element) {
        const rect = query.element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const distance = Math.abs(elementTop - scrollPosition);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== this.currentActiveIndex) {
      this.sidebar.updateActiveItem(closestIndex);
      this.currentActiveIndex = closestIndex;
    }
  }

  // Detect URL changes (conversation switches)
  setupUrlChangeDetection() {
    let lastUrl = window.location.href;

    const urlObserver = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('urlChanged')}`);
        lastUrl = currentUrl;
        this.handleConversationChange();
      }
    });

    urlObserver.observe(document.querySelector('title') || document.head, {
      childList: true,
      subtree: true
    });

    window.addEventListener('popstate', () => {
      this.handleConversationChange();
    });

    setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== this.currentConversationUrl) {
        console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('urlChangedPolling')}`);
        this.handleConversationChange();
      }
    }, 1000);
  }

  // Handle conversation change
  handleConversationChange() {
    const newUrl = window.location.href;

    if (newUrl === this.currentConversationUrl) {
      return;
    }

    this.currentConversationUrl = newUrl;

    // Reset state
    this.queries = [];
    this.currentActiveIndex = -1;

    document.querySelectorAll('.ctn-highlight').forEach(el => {
      el.classList.remove('ctn-highlight');
    });

    // Re-insert expand button to fix missing button after conversation switch
    this.sidebar.reinsertExpandButton();

    setTimeout(() => {
      this.scanExistingQueries();
      console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('reloaded')}`);
    }, 500);
  }
}
