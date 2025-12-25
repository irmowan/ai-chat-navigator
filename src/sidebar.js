// Sidebar UI module

class Sidebar {
  constructor(i18n, platformName = 'default', adapter = null) {
    this.i18n = i18n;
    this.platformName = platformName;
    this.adapter = adapter;
    this.element = null;
    this.expandButton = null;
    this.isVisible = true;
    this.width = 280;
    this.isResizing = false;
    this.onToggle = null;
    this.onSearch = null;
    this.onItemClick = null;
  }

  // Get platform-specific storage key
  getStorageKey(key) {
    return `${this.platformName}_${key}`;
  }

  // Create sidebar UI
  create() {
    if (this.element) {
      return;
    }

    this.createExpandButton();

    this.element = document.createElement('div');
    this.element.id = 'chatgpt-turn-finder-sidebar';
    this.element.className = 'ctn-sidebar';

    // Apply initial hidden state if needed (before appending to DOM)
    if (!this.isVisible) {
      this.element.classList.add('ctn-hidden');
    }

    // Apply initial hidden state if needed (before appending to DOM)
    if (!this.isVisible) {
      this.element.classList.add('ctn-hidden');
    }

    this.element.innerHTML = `
      <div class="ctn-resize-handle" title="${this.i18n.getText('resize')}"></div>
      <div class="ctn-header">
        <h3 class="ctn-title">${this.i18n.getText('title')}</h3>
        <button class="ctn-toggle-btn" title="${this.i18n.getText('collapse')}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="ctn-search-container">
        <input type="text" class="ctn-search-input" placeholder="${this.i18n.getText('search')}" />
      </div>
      <div class="ctn-list" id="ctn-query-list"></div>
    `;

    document.body.appendChild(this.element);

    this.restoreWidth();
    this.setupEventListeners();
    this.setupResizeHandle();

    console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('created')}`);
  }

  // Setup event listeners
  setupEventListeners() {
    this.element.querySelector('.ctn-toggle-btn').addEventListener('click', () => {
      this.toggle();
    });

    this.element.querySelector('.ctn-search-input').addEventListener('input', (e) => {
      if (this.onSearch) {
        this.onSearch(e.target.value);
      }
    });
  }

  // Update query list
  update(queries) {
    if (!this.element) {
      return;
    }

    const listContainer = this.element.querySelector('#ctn-query-list');
    listContainer.innerHTML = '';

    if (queries.length === 0) {
      listContainer.innerHTML = `<div class="ctn-empty">${this.i18n.getText('empty')}</div>`;
      return;
    }

    queries.forEach((query, index) => {
      const item = document.createElement('div');
      item.className = 'ctn-query-item';
      item.dataset.index = index;

      item.innerHTML = `
        <span class="ctn-query-number">#${index + 1}</span>
        <span class="ctn-query-text" title="${query.text}">${query.text}</span>
      `;

      item.addEventListener('click', () => {
        if (this.onItemClick) {
          this.onItemClick(index);
        }
      });

      listContainer.appendChild(item);
    });
  }

  // Filter queries
  filter(searchTerm) {
    const items = this.element.querySelectorAll('.ctn-query-item');
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

  // Update active item
  updateActiveItem(index) {
    const items = this.element.querySelectorAll('.ctn-query-item');
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add('ctn-active');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('ctn-active');
      }
    });
  }

  // Create expand button
  createExpandButton() {
    if (this.expandButton) {
      return;
    }

    this.expandButton = document.createElement('button');
    this.expandButton.className = 'ctn-expand-btn';
    this.expandButton.title = this.i18n.getText('expand');
    this.expandButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8 4L14 10L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    this.expandButton.addEventListener('click', () => {
      this.toggle();
    });

    this.insertExpandButtonToToolbar();
  }

  // Insert expand button to toolbar
  insertExpandButtonToToolbar() {
    // Use platform-specific insertion points if adapter is available
    if (this.adapter && typeof this.adapter.getExpandButtonInsertionPoints === 'function') {
      const insertionPoints = this.adapter.getExpandButtonInsertionPoints();

      for (const point of insertionPoints) {
        const targetElement = document.querySelector(point.selector);
        if (targetElement) {
          // If inserting into body, use container for proper positioning
          if (point.selector === 'body') {
            const container = document.createElement('div');
            container.className = 'ctn-expand-btn-container';
            container.appendChild(this.expandButton);
            targetElement.appendChild(container);
            console.log(`[${this.platformName}] Expand button inserted into body with container`);
          } else if (point.insertMethod === 'prepend') {
            targetElement.insertBefore(this.expandButton, targetElement.firstChild);
            console.log(`[${this.platformName}] Expand button prepended to ${point.selector}`);
          } else {
            targetElement.appendChild(this.expandButton);
            console.log(`[${this.platformName}] Expand button appended to ${point.selector}`);
          }
          return;
        }
      }
      console.warn(`[${this.platformName}] No insertion points found, falling back to generic method`);
    }

    // Fallback to generic ChatGPT-specific logic
    const actionsContainer = document.querySelector('#conversation-header-actions');

    if (actionsContainer) {
      actionsContainer.appendChild(this.expandButton);
      console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('buttonInserted')}`);
      return;
    }

    const shareButton = document.querySelector('header button[aria-label*="Share"], header button[data-testid*="share"]');
    if (shareButton) {
      const targetContainer = shareButton.closest('.flex.items-center');
      if (targetContainer) {
        targetContainer.appendChild(this.expandButton);
        console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('buttonInsertedFallback')}`);
        return;
      }
    }

    const container = document.createElement('div');
    container.className = 'ctn-expand-btn-container';
    container.appendChild(this.expandButton);
    document.body.appendChild(container);
    console.log(`[ChatGPT Turn Navigator] ${this.i18n.getText('buttonInsertedContainer')}`);
  }

  // Toggle sidebar visibility
  toggle() {
    this.isVisible = !this.isVisible;

    if (this.isVisible) {
      this.element.classList.remove('ctn-hidden');
      this.expandButton.classList.add('ctn-hidden');
    } else {
      this.element.classList.add('ctn-hidden');
      this.expandButton.classList.remove('ctn-hidden');
    }

    chrome.storage.local.set({ [this.getStorageKey('sidebarVisible')]: this.isVisible });
    console.log(`[ChatGPT Turn Navigator] Sidebar ${this.isVisible ? this.i18n.getText('shown') : this.i18n.getText('hidden')}`);

    if (this.onToggle) {
      this.onToggle(this.isVisible);
    }
  }

  // Restore visibility state (synchronous, called before create)
  async restoreState() {
    return new Promise((resolve) => {
      const visibilityKey = this.getStorageKey('sidebarVisible');
      const widthKey = this.getStorageKey('sidebarWidth');

      chrome.storage.local.get([visibilityKey, widthKey], (result) => {
        if (result[visibilityKey] === false) {
          this.isVisible = false;
        }
        if (result[widthKey]) {
          this.width = result[widthKey];
        }
        resolve();
      });
    });
  }

  // Update expand button visibility (called after sidebar is created)
  updateExpandButtonVisibility() {
    if (!this.isVisible && this.expandButton) {
      this.expandButton.classList.remove('ctn-hidden');
    }
  }

  // Setup resize handle
  setupResizeHandle() {
    const resizeHandle = this.element.querySelector('.ctn-resize-handle');

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
        this.width = newWidth;
        this.element.style.width = `${newWidth}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isResizing) {
        this.isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        chrome.storage.local.set({ [this.getStorageKey('sidebarWidth')]: this.width });
      }
    });
  }

  // Restore sidebar width
  restoreWidth() {
    // Width already restored in restoreState, just apply it
    if (this.width) {
      this.element.style.width = `${this.width}px`;
    }
  }

  // Re-insert expand button (for conversation changes)
  reinsertExpandButton() {
    if (this.expandButton && !this.isVisible) {
      this.expandButton.remove();
      this.expandButton = null;
      this.createExpandButton();
      this.expandButton.classList.remove('ctn-hidden');
    }
  }
}
