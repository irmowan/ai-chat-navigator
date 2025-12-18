// ChatGPT Turn Navigator

class ChatGPTTurnNavigator {
  constructor() {
    this.queries = [];
    this.sidebar = null;
    this.observer = null;
    this.isVisible = true;
    this.currentActiveIndex = -1;
    this.currentConversationUrl = window.location.href;
    this.sidebarWidth = 280;
    this.isResizing = false;

    this.init();
  }

  init() {
    console.log('[ChatGPT Turn Navigator] Initializing...');

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    setTimeout(() => {
      this.createSidebar();
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
        console.log(`[ChatGPT Turn Navigator] Found ${userMessages.length} messages`);
        break;
      }
    }

    if (userMessages.length === 0) {
      const allMessages = document.querySelectorAll('article, [class*="message"], [class*="turn"]');
      userMessages = Array.from(allMessages).filter(msg => {
        const text = msg.textContent.trim();
        return text.length > 0 && !msg.querySelector('[class*="assistant"]');
      });
      console.log(`[ChatGPT Turn Navigator] Found ${userMessages.length} messages with fallback method`);
    }

    userMessages.forEach((element, index) => {
      this.addQuery(element, index);
    });

    this.updateSidebar();
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
    console.log(`[ChatGPT Turn Navigator] Added query #${query.index + 1}: ${textContent.substring(0, 50)}...`);
  }

  // Extract text content
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
        this.updateSidebar();
      }
    });

    this.observer.observe(document.body, config);
    console.log('[ChatGPT Turn Navigator] DOM observer started');
  }

  isUserMessage(element) {
    return element.hasAttribute?.('data-message-author-role') &&
           element.getAttribute('data-message-author-role') === 'user';
  }

  // Create sidebar
  createSidebar() {
    if (this.sidebar) {
      return;
    }

    this.createExpandButton();

    this.sidebar = document.createElement('div');
    this.sidebar.id = 'chatgpt-turn-finder-sidebar';
    this.sidebar.className = 'ctn-sidebar';

    this.sidebar.innerHTML = `
      <div class="ctn-resize-handle" title="Drag to resize"></div>
      <div class="ctn-header">
        <h3 class="ctn-title">Navigation</h3>
        <button class="ctn-toggle-btn" title="Collapse sidebar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="ctn-search-container">
        <input type="text" class="ctn-search-input" placeholder="Search..." />
      </div>
      <div class="ctn-list" id="ctn-query-list"></div>
    `;

    document.body.appendChild(this.sidebar);

    this.restoreSidebarWidth();

    this.sidebar.querySelector('.ctn-toggle-btn').addEventListener('click', () => {
      this.toggleSidebar();
    });

    this.sidebar.querySelector('.ctn-search-input').addEventListener('input', (e) => {
      this.filterQueries(e.target.value);
    });

    this.setupResizeHandle();

    console.log('[ChatGPT Turn Navigator] Sidebar created');
  }

  // Update sidebar list
  updateSidebar() {
    if (!this.sidebar) {
      return;
    }

    const listContainer = this.sidebar.querySelector('#ctn-query-list');
    listContainer.innerHTML = '';

    if (this.queries.length === 0) {
      listContainer.innerHTML = '<div class="ctn-empty">No queries yet</div>';
      return;
    }

    this.queries.forEach((query, index) => {
      const item = document.createElement('div');
      item.className = 'ctn-query-item';
      item.dataset.index = index;

      item.innerHTML = `
        <span class="ctn-query-number">#${index + 1}</span>
        <span class="ctn-query-text" title="${query.text}">${query.text}</span>
      `;

      item.addEventListener('click', () => {
        this.scrollToQuery(index);
      });

      listContainer.appendChild(item);
    });
  }

  // Filter queries
  filterQueries(searchTerm) {
    const items = this.sidebar.querySelectorAll('.ctn-query-item');
    const term = searchTerm.toLowerCase().trim();

    items.forEach((item) => {
      const text = item.querySelector('.ctn-query-text').textContent.toLowerCase();
      if (text.includes(term)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Scroll to query
  scrollToQuery(index) {
    const query = this.queries[index];
    if (!query || !query.element) {
      console.warn(`[ChatGPT Turn Navigator] Query #${index + 1} not found`);
      return;
    }

    this.highlightElement(query.element);

    query.element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });

    this.updateActiveItem(index);

    console.log(`[ChatGPT Turn Navigator] Scrolled to query #${index + 1}`);
  }

  // Highlight element
  highlightElement(element) {
    document.querySelectorAll('.ctn-highlight').forEach(el => {
      el.classList.remove('ctn-highlight');
    });

    element.classList.add('ctn-highlight');

    setTimeout(() => {
      element.classList.remove('ctn-highlight');
    }, 3000);
  }

  // Update active item
  updateActiveItem(index) {
    const items = this.sidebar.querySelectorAll('.ctn-query-item');
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add('ctn-active');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('ctn-active');
      }
    });
    this.currentActiveIndex = index;
  }

  // Setup scroll listener
  setupScrollListener() {
    let scrollTimeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.updateCurrentPosition();
      }, 150);
    }, { passive: true });
  }

  // Update current position
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
      this.updateActiveItem(closestIndex);
    }
  }

  // Create expand button
  createExpandButton() {
    if (this.expandButton) {
      return;
    }

    this.expandButton = document.createElement('button');
    this.expandButton.className = 'ctn-expand-btn';
    this.expandButton.title = 'Expand navigation';
    this.expandButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8 4L14 10L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    this.expandButton.addEventListener('click', () => {
      this.toggleSidebar();
    });

    this.insertExpandButtonToToolbar();
  }

  // Insert expand button to toolbar
  insertExpandButtonToToolbar() {
    const actionsContainer = document.querySelector('#conversation-header-actions');

    if (actionsContainer) {
      actionsContainer.appendChild(this.expandButton);
      console.log('[ChatGPT Turn Navigator] Expand button inserted to toolbar');
      return;
    }

    const shareButton = document.querySelector('header button[aria-label*="Share"], header button[data-testid*="share"]');
    if (shareButton) {
      const targetContainer = shareButton.closest('.flex.items-center');
      if (targetContainer) {
        targetContainer.appendChild(this.expandButton);
        console.log('[ChatGPT Turn Navigator] Expand button inserted (fallback method)');
        return;
      }
    }

    const container = document.createElement('div');
    container.className = 'ctn-expand-btn-container';
    container.appendChild(this.expandButton);
    document.body.appendChild(container);
    console.log('[ChatGPT Turn Navigator] Expand button inserted (fallback container)');
  }

  // Toggle sidebar
  toggleSidebar() {
    this.isVisible = !this.isVisible;

    if (this.isVisible) {
      this.sidebar.classList.remove('ctn-hidden');
      this.expandButton.classList.add('ctn-hidden');
    } else {
      this.sidebar.classList.add('ctn-hidden');
      this.expandButton.classList.remove('ctn-hidden');
    }

    chrome.storage.local.set({ sidebarVisible: this.isVisible });
    console.log(`[ChatGPT Turn Navigator] Sidebar ${this.isVisible ? 'shown' : 'hidden'}`);
  }

  // Restore sidebar state
  restoreState() {
    chrome.storage.local.get(['sidebarVisible'], (result) => {
      if (result.sidebarVisible === false) {
        this.isVisible = false;
        this.sidebar.classList.add('ctn-hidden');
        this.expandButton.classList.remove('ctn-hidden');
      }
    });
  }

  // Setup resize handle
  setupResizeHandle() {
    const resizeHandle = this.sidebar.querySelector('.ctn-resize-handle');

    resizeHandle.addEventListener('mousedown', (e) => {
      this.isResizing = true;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 240;
      const maxWidth = 600;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        this.sidebarWidth = newWidth;
        this.sidebar.style.width = `${newWidth}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isResizing) {
        this.isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // 保存宽度
        chrome.storage.local.set({ sidebarWidth: this.sidebarWidth });
      }
    });
  }

  // Restore sidebar width
  restoreSidebarWidth() {
    chrome.storage.local.get(['sidebarWidth'], (result) => {
      if (result.sidebarWidth) {
        this.sidebarWidth = result.sidebarWidth;
        this.sidebar.style.width = `${this.sidebarWidth}px`;
      }
    });
  }

  // Detect conversation changes
  setupUrlChangeDetection() {
    let lastUrl = window.location.href;

    const urlObserver = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        console.log('[ChatGPT Turn Navigator] URL changed, reloading queries...');
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
        console.log('[ChatGPT Turn Navigator] URL changed (polling), reloading queries...');
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

    this.queries = [];
    this.currentActiveIndex = -1;

    document.querySelectorAll('.ctn-highlight').forEach(el => {
      el.classList.remove('ctn-highlight');
    });

    // Re-insert expand button to fix missing button after conversation switch
    if (this.expandButton && !this.isVisible) {
      this.expandButton.remove();
      this.expandButton = null;
      this.createExpandButton();
      this.expandButton.classList.remove('ctn-hidden');
    }

    setTimeout(() => {
      this.scanExistingQueries();
      console.log('[ChatGPT Turn Navigator] Reloaded queries for new conversation');
    }, 500);
  }
}

// Initialize
if (window.location.hostname.includes('chatgpt.com') || window.location.hostname.includes('chat.openai.com')) {
  window.turnFinder = new ChatGPTTurnNavigator();
}

