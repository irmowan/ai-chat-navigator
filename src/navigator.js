// Core navigation logic module

class Navigator {
  constructor(i18n, sidebar, adapter) {
    this.i18n = i18n;
    this.sidebar = sidebar;
    this.adapter = adapter;
    this.queries = [];
    this.observer = null;
    this.currentActiveIndex = -1;
    this.currentConversationUrl = window.location.href;
  }

  // Initialize navigator
  init() {
    console.log(`${this.adapter.getLogPrefix()} Initializing...`);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  // Start navigation system
  async start() {
    const delay = this.adapter.getInitializationDelay();
    setTimeout(async () => {
      // Restore state before creating UI to prevent flashing
      await this.sidebar.restoreState();

      this.sidebar.create();
      this.sidebar.updateExpandButtonVisibility();

      // Apply platform-specific custom styles
      this.applyCustomStyles();

      // Setup sidebar callbacks
      this.sidebar.onItemClick = (index) => this.scrollToQuery(index);
      this.sidebar.onSearch = (term) => this.sidebar.filter(term);

      this.scanExistingQueries();
      this.startObserving();
      this.setupScrollListener();
      this.setupUrlChangeDetection();

      console.log(`${this.adapter.getLogPrefix()} Started successfully`);
    }, delay);
  }

  // Apply platform-specific custom styles
  applyCustomStyles() {
    console.log(`${this.adapter.getLogPrefix()} Attempting to apply custom styles...`);
    const customStyles = this.adapter.getCustomStyles();
    console.log(`${this.adapter.getLogPrefix()} Custom styles content:`, customStyles);

    if (customStyles && customStyles.trim()) {
      const styleId = 'ctn-platform-styles';
      // Remove existing style if any
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
        console.log(`${this.adapter.getLogPrefix()} Removed existing styles`);
      }

      // Inject new styles
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = customStyles;
      document.head.appendChild(styleElement);
      console.log(`${this.adapter.getLogPrefix()} Applied custom styles successfully`);
    } else {
      console.log(`${this.adapter.getLogPrefix()} No custom styles to apply`);
    }
  }

  // Scan existing queries on page
  scanExistingQueries() {
    const selectors = this.adapter.getMessageSelectors();

    let userMessages = [];
    for (const selector of selectors) {
      userMessages = document.querySelectorAll(selector);
      if (userMessages.length > 0) {
        console.log(`${this.adapter.getLogPrefix()} Found ${userMessages.length} ${this.i18n.getText('found')}`);
        break;
      }
    }

    if (userMessages.length === 0) {
      const allMessages = document.querySelectorAll('article, [class*="message"], [class*="turn"]');
      userMessages = Array.from(allMessages).filter(msg => {
        const text = msg.textContent.trim();
        return text.length > 0 && !msg.querySelector('[class*="assistant"]');
      });
      console.log(`${this.adapter.getLogPrefix()} Found ${userMessages.length} ${this.i18n.getText('foundFallback')}`);
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
    console.log(`${this.adapter.getLogPrefix()} ${this.i18n.getText('added')} #${query.index + 1}: ${textContent.substring(0, 50)}...`);
  }

  // Extract text content from element
  extractTextContent(element) {
    return this.adapter.extractMessageText(element);
  }

  // Start observing DOM changes
  startObserving() {
    const target = this.adapter.getObserverTarget();
    const config = this.adapter.getObserverConfig();

    this.observer = new MutationObserver((mutations) => {
      let hasNewMessages = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          const messages = this.adapter.findUserMessagesInNode(node);
          if (messages.length > 0) {
            messages.forEach(msg => this.addQuery(msg));
            hasNewMessages = true;
          }
        });
      });

      if (hasNewMessages) {
        this.sidebar.update(this.queries);
      }
    });

    this.observer.observe(target, config);
    console.log(`${this.adapter.getLogPrefix()} ${this.i18n.getText('observerStarted')}`);
  }

  // Check if element is a user message
  isUserMessage(element) {
    return this.adapter.isUserMessage(element);
  }

  // Scroll to specific query
  scrollToQuery(index) {
    const query = this.queries[index];
    if (!query || !query.element) {
      console.warn(`${this.adapter.getLogPrefix()} ${this.i18n.getText('notFound')} #${index + 1} ${this.i18n.getText('notFoundSuffix')}`);
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

    console.log(`${this.adapter.getLogPrefix()} ${this.i18n.getText('scrolled')} #${index + 1}`);
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
        if (this.adapter.shouldReinitialize(lastUrl, currentUrl)) {
          console.log(`${this.adapter.getLogPrefix()} ${this.i18n.getText('urlChanged')}`);
          lastUrl = currentUrl;
          this.handleConversationChange();
        }
      }
    });

    urlObserver.observe(document.querySelector('title') || document.head, {
      childList: true,
      subtree: true
    });

    window.addEventListener('popstate', () => {
      this.handleConversationChange();
    });

    const pollingInterval = this.adapter.getUrlPollingInterval();
    setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== this.currentConversationUrl) {
        if (this.adapter.shouldReinitialize(this.currentConversationUrl, currentUrl)) {
          console.log(`${this.adapter.getLogPrefix()} ${this.i18n.getText('urlChangedPolling')}`);
          this.handleConversationChange();
        }
      }
    }, pollingInterval);
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

    const delay = this.adapter.getConversationSwitchDelay();
    setTimeout(() => {
      this.scanExistingQueries();
      console.log(`${this.adapter.getLogPrefix()} ${this.i18n.getText('reloaded')}`);
    }, delay);
  }
}
