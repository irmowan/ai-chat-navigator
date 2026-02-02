// Search bar component

export class SearchBar {
  private container: HTMLElement;
  private input: HTMLInputElement;
  private onSearch: ((query: string) => void) | null = null;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'ai-nav-search-bar';

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Search conversations...';
    this.input.className = 'ai-nav-search-input';

    this.input.addEventListener('input', () => {
      this.onSearch?.(this.input.value);
    });

    this.container.appendChild(this.input);
  }

  setOnSearch(callback: (query: string) => void): void {
    this.onSearch = callback;
  }

  getElement(): HTMLElement {
    return this.container;
  }

  clear(): void {
    this.input.value = '';
  }
}
