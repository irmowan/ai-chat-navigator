// Content script entry point

import { detectPlatform } from '../utils/platform-detector';
import { Navigator } from '../core/navigator';
import { NavigatorPanel } from '../components/NavigatorPanel';
import { getNavigatorState } from '../utils/storage';
import './styles.css';

console.log('[AI Navigator] Content script loaded Yimu');
console.log('[AI Navigator] Content script loaded');

let panel: NavigatorPanel | null = null;
let navigator: Navigator | null = null;
let lastUrl = location.href;

// Wait for page to be ready
function init() {
  // Detect platform
  const adapter = detectPlatform();

  if (!adapter) {
    console.log('[AI Navigator] No supported platform detected on this page');
    return;
  }

  console.log(`[AI Navigator] Initializing for ${adapter.getPlatformName()}`);

  // Wait a bit for the page to fully load
  setTimeout(() => {
    try {
      // Create UI (only once)
      if (!panel) {
        panel = new NavigatorPanel();
      }

      // Create navigator (only once)
      if (!navigator) {
        navigator = new Navigator(adapter);

        // Set up event handlers
        panel.setOnTurnClick((turnId) => {
          navigator!.navigateToTurn(turnId);
        });

        panel.setOnSearch((query) => {
          const filteredTurns = navigator!.filterTurns(query);
          panel!.updateTurns(filteredTurns);
        });

        // Initialize navigator
        navigator.init({
          onTurnsUpdate: (turns) => {
            panel!.updateTurns(turns);
          },
          onCurrentTurnChange: (turnId) => {
            panel!.setActiveTurn(turnId);
          },
          onToggle: () => {
            panel!.toggle();
          },
        });

        // Restore saved state
        getNavigatorState().then((state) => {
          if (state) {
            panel!.setExpanded(state.isExpanded);
          }
        });
      } else {
        // Re-parse conversations when navigating to different chat
        navigator.refreshConversations();
      }

      console.log('[AI Navigator] Successfully initialized');
    } catch (error) {
      console.error('[AI Navigator] Initialization error:', error);
    }
  }, 1000);
}

// Monitor URL changes for SPA navigation
function observeUrlChanges() {
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log('[AI Navigator] URL changed, re-initializing');
      init();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    observeUrlChanges();
  });
} else {
  init();
  observeUrlChanges();
}
