# AI Turn Navigator

A browser extension that adds a floating sidebar to AI conversation platforms like ChatGPT, Gemini, and Copilot for easy navigation between conversation turns.

## Features

- **Right-side floating panel** with collapsible navigator
- **Conversation turn detection** - displays the first 50 characters of each user question
- **Click to jump** - smooth scroll to any conversation turn with highlight effect
- **Auto-positioning** - automatically highlights current position as you scroll
- **Search/filter** - quickly find specific conversation turns
- **Keyboard shortcuts**:
  - `Ctrl/Cmd + ↑` - Navigate to previous turn
  - `Ctrl/Cmd + ↓` - Navigate to next turn
  - `n` - Toggle navigator panel
- **Multi-platform support** - extensible architecture for ChatGPT, Gemini, Copilot, and more

## Installation

### Development Build

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` directory

The extension should now load without errors and be ready to use on ChatGPT.

### Development Mode (with HMR)

```bash
npm run dev
```

This starts Vite in development mode with hot module replacement.

## Project Structure

```
ai-turn-navigator/
├── src/
│   ├── core/                      # Platform-agnostic core logic
│   │   ├── navigator.ts           # Main navigator controller
│   │   ├── scroll-tracker.ts      # Scroll position tracking
│   │   └── keyboard-handler.ts    # Keyboard shortcuts
│   ├── platforms/                 # Platform-specific adapters
│   │   ├── base/
│   │   │   └── PlatformAdapter.ts # Abstract adapter interface
│   │   ├── chatgpt/
│   │   │   ├── ChatGPTAdapter.ts  # ChatGPT implementation
│   │   │   └── dom-selectors.ts   # DOM selectors for ChatGPT
│   │   ├── gemini/                # Gemini support (planned)
│   │   └── copilot/               # Copilot support (planned)
│   ├── components/                # UI components
│   │   ├── NavigatorPanel.ts      # Main sidebar panel
│   │   ├── TurnItem.ts            # Individual turn items
│   │   └── SearchBar.ts           # Search functionality
│   ├── utils/                     # Utilities
│   │   ├── platform-detector.ts   # Auto-detect platform
│   │   ├── storage.ts             # Chrome storage wrapper
│   │   └── constants.ts           # Constants
│   ├── content/
│   │   ├── index.ts               # Content script entry
│   │   └── styles.css             # UI styles
│   └── types/
│       └── index.ts               # TypeScript types
├── public/
│   └── manifest.json              # Chrome extension manifest
└── dist/                          # Built extension (generated)
```

## Architecture

### Multi-Platform Design

The extension uses the **Adapter Pattern** to support multiple AI platforms:

1. **PlatformAdapter** (abstract base class) - Defines the interface for platform-specific logic
2. **ChatGPTAdapter** - ChatGPT-specific DOM parsing and observation
3. **GeminiAdapter** - Gemini support (placeholder for future implementation)
4. **CopilotAdapter** - Copilot support (placeholder for future implementation)

To add a new platform:
1. Create a new adapter extending `PlatformAdapter`
2. Implement the required methods (`parseConversations`, `observeNewMessages`, etc.)
3. Add the adapter to `platform-detector.ts`

### Core Components

- **Navigator** - Platform-agnostic navigation logic
- **ScrollTracker** - Uses IntersectionObserver to track visible conversation turns
- **KeyboardHandler** - Global keyboard shortcut management
- **NavigatorPanel** - UI component for the sidebar

## Usage

1. Navigate to ChatGPT (https://chatgpt.com)
2. Start or continue a conversation
3. The navigator panel appears on the right side
4. Click any conversation turn to jump to it
5. Use the search bar to filter turns
6. Press `n` to collapse/expand the panel

## Current Platform Support

- ✅ **ChatGPT** (chatgpt.com, chat.openai.com) - Fully implemented
- ⏳ **Gemini** (gemini.google.com) - Planned
- ⏳ **Copilot** (copilot.microsoft.com) - Planned

## Development Notes

### Testing with Playwright MCP

The extension can be tested using Playwright MCP tools:

```javascript
// Navigate to ChatGPT
await browser_navigate('https://chatgpt.com');

// Take a snapshot to verify the navigator appears
await browser_snapshot();

// Take a screenshot
await browser_take_screenshot({ filename: 'navigator-test.png' });

// Test clicking on a turn item
await browser_click({ ref: 'turn-item-ref' });

// Check console for errors
await browser_console_messages({ level: 'error' });
```

### Debugging

Enable verbose logging by checking the browser console:
- Look for messages prefixed with `[AI Navigator]`
- Check for DOM parsing results
- Monitor MutationObserver activity

### ChatGPT DOM Structure

The ChatGPT adapter uses multiple selector strategies to handle potential DOM changes:
- Conversation containers: `main` element
- Message groups: `[data-testid^="conversation-turn"]`, `article`, etc.
- User messages: `[data-message-author-role="user"]`
- AI responses: `[data-message-author-role="assistant"]`

## Technical Stack

- **TypeScript** - Type-safe development
- **Vite** - Fast build tool with HMR
- **@crxjs/vite-plugin** - Chrome extension support for Vite
- **Tailwind CSS v4** - Utility-first styling
- **Chrome Extension Manifest V3** - Modern extension API

## Known Issues

- Icon files are not included in the current build (extension works but has no icon)
- ChatGPT's DOM structure may change, requiring selector updates
- Gemini and Copilot adapters are placeholders

## Contributing

To add support for a new platform:

1. Create `src/platforms/yourplatform/YourPlatformAdapter.ts`
2. Extend `PlatformAdapter` and implement all abstract methods
3. Add DOM selectors in `src/platforms/yourplatform/dom-selectors.ts`
4. Register the adapter in `src/utils/platform-detector.ts`

## License

MIT
