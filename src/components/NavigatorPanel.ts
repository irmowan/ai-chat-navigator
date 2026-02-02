// Main navigator panel component

import { ConversationTurn } from '../types';
import { CONSTANTS } from '../utils/constants';
import { TurnItem } from './TurnItem';
import { SearchBar } from './SearchBar';
import { saveNavigatorState } from '../utils/storage';

export class NavigatorPanel {
  private container: HTMLElement;
  private header: HTMLElement;
  private searchBar: SearchBar;
  private turnList: HTMLElement;
  private turnItems: TurnItem[] = [];
  private isExpanded: boolean = false;
  private currentTurnId: string | null = null;
  private onTurnClick: ((turnId: string) => void) | null = null;
  private toolbarButton: HTMLElement | null = null;
  private toolbarButtonIcon: HTMLElement | null = null;
  private collapseButtonIcon: HTMLElement | null = null;
  private hasTurns: boolean = false;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = CONSTANTS.CLASSES.NAVIGATOR_PANEL;
    this.container.style.width = `${CONSTANTS.NAVIGATOR_WIDTH}px`;

    // Create header with collapse button
    this.header = this.createHeader();
    this.container.appendChild(this.header);

    // Create search bar
    this.searchBar = new SearchBar();
    this.container.appendChild(this.searchBar.getElement());

    // Create turn list
    this.turnList = document.createElement('div');
    this.turnList.className = 'ai-nav-turn-list';
    this.container.appendChild(this.turnList);

    // Inject panel into page (collapsed by default)
    this.container.classList.add('ai-nav-panel-collapsed');
    document.body.appendChild(this.container);

    // Inject toolbar button
    this.injectToolbarButton();
  }

  private createChevronIcon(direction: 'left' | 'right'): string {
    const path = direction === 'left'
      ? 'M15 19l-7-7 7-7'  // <
      : 'M9 5l7 7-7 7';     // >
    return `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="${path}"/>
      </svg>
    `;
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'ai-nav-header';

    const title = document.createElement('h3');
    title.className = 'ai-nav-title';
    title.textContent = 'Navigator';

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'ai-nav-collapse-btn';
    collapseBtn.title = 'Collapse navigator';

    this.collapseButtonIcon = document.createElement('span');
    this.collapseButtonIcon.className = 'ai-nav-btn-icon';
    this.collapseButtonIcon.innerHTML = this.createChevronIcon('right');
    collapseBtn.appendChild(this.collapseButtonIcon);

    collapseBtn.addEventListener('click', () => {
      this.collapse();
    });

    header.appendChild(title);
    header.appendChild(collapseBtn);

    return header;
  }

  private injectToolbarButton(): void {
    // Try to find ChatGPT's toolbar and inject our button
    const tryInject = () => {
      // Find the Share button and its parent container
      const shareButton = Array.from(document.querySelectorAll('header button')).find(
        btn => btn.textContent?.includes('Share')
      );
      const toolbar = shareButton?.parentElement;

      if (toolbar && !document.querySelector('.ai-nav-toolbar-btn')) {
        this.toolbarButton = document.createElement('button');
        this.toolbarButton.className = 'ai-nav-toolbar-btn';

        this.toolbarButtonIcon = document.createElement('span');
        this.toolbarButtonIcon.className = 'ai-nav-btn-icon';
        this.toolbarButtonIcon.innerHTML = this.createChevronIcon('left');
        this.toolbarButton.appendChild(this.toolbarButtonIcon);

        this.toolbarButton.title = 'Open Navigator';
        this.toolbarButton.style.display = 'none'; // Hidden until we have turns
        this.toolbarButton.addEventListener('click', () => {
          this.toggle();
        });

        // Insert at the end of toolbar (after Share button)
        toolbar.appendChild(this.toolbarButton);
      }
    };

    // Try immediately and also observe for toolbar appearance
    tryInject();

    // Observe DOM changes to inject button when toolbar appears
    const observer = new MutationObserver(() => {
      if (!document.querySelector('.ai-nav-toolbar-btn')) {
        tryInject();
      }
      this.updateToolbarButtonVisibility();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private updateToolbarButtonVisibility(): void {
    if (this.toolbarButton) {
      this.toolbarButton.style.display = this.hasTurns ? 'flex' : 'none';
    }
  }

  setOnTurnClick(callback: (turnId: string) => void): void {
    this.onTurnClick = callback;
  }

  setOnSearch(callback: (query: string) => void): void {
    this.searchBar.setOnSearch(callback);
  }

  updateTurns(turns: ConversationTurn[]): void {
    // Clear existing items
    this.turnList.innerHTML = '';
    this.turnItems = [];

    this.hasTurns = turns.length > 0;
    this.updateToolbarButtonVisibility();

    // Create new items
    turns.forEach((turn, index) => {
      const item = new TurnItem(turn, index);
      item.setOnClick((turnId) => {
        this.onTurnClick?.(turnId);
      });

      this.turnItems.push(item);
      this.turnList.appendChild(item.getElement());
    });

    // Restore active state
    if (this.currentTurnId) {
      this.setActiveTurn(this.currentTurnId);
    }
  }

  setActiveTurn(turnId: string): void {
    this.currentTurnId = turnId;

    this.turnItems.forEach(item => {
      item.setActive(item.getTurnId() === turnId);
    });
  }

  toggle(): void {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  expand(): void {
    this.isExpanded = true;
    this.container.classList.remove('ai-nav-panel-collapsed');
    this.updateToolbarButtonState();
    this.saveState();
  }

  collapse(): void {
    this.isExpanded = false;
    this.container.classList.add('ai-nav-panel-collapsed');
    this.updateToolbarButtonState();
    this.saveState();
  }

  private updateToolbarButtonState(): void {
    if (this.toolbarButton && this.toolbarButtonIcon) {
      if (this.isExpanded) {
        this.toolbarButton.classList.add('ai-nav-toolbar-btn-active');
        this.toolbarButtonIcon.innerHTML = this.createChevronIcon('right');
        this.toolbarButton.title = 'Close Navigator';
      } else {
        this.toolbarButton.classList.remove('ai-nav-toolbar-btn-active');
        this.toolbarButtonIcon.innerHTML = this.createChevronIcon('left');
        this.toolbarButton.title = 'Open Navigator';
      }
    }
  }

  private saveState(): void {
    saveNavigatorState({
      isExpanded: this.isExpanded,
      currentTurnId: this.currentTurnId,
      searchQuery: '',
    });
  }

  setExpanded(expanded: boolean): void {
    if (expanded) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  destroy(): void {
    this.container.remove();
    this.toolbarButton?.remove();
  }
}
