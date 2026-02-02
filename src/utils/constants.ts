// Constants for the AI Turn Navigator

export const CONSTANTS = {
  // Navigator UI
  NAVIGATOR_WIDTH: 280,
  NAVIGATOR_MIN_WIDTH: 200,
  NAVIGATOR_MAX_WIDTH: 400,

  // Keyboard shortcuts
  SHORTCUTS: {
    NEXT_TURN: 'ArrowDown',
    PREV_TURN: 'ArrowUp',
    TOGGLE_NAVIGATOR: 'n',
  },

  // CSS classes
  CLASSES: {
    NAVIGATOR_PANEL: 'ai-nav-panel',
    NAVIGATOR_COLLAPSED: 'ai-nav-collapsed',
    TURN_ITEM: 'ai-nav-turn-item',
    TURN_ACTIVE: 'ai-nav-turn-active',
    HIGHLIGHT: 'ai-nav-highlight',
  },

  // Storage keys
  STORAGE_KEYS: {
    NAVIGATOR_STATE: 'ai-navigator-state',
  },

  // Timing
  SCROLL_DEBOUNCE: 150,
  HIGHLIGHT_DURATION: 2000,
};
