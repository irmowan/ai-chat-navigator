# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start Vite dev server with HMR (port 5173)
npm run build    # Build production extension (outputs to dist/)
npm run preview  # Preview production build
```

## Loading the Extension

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist/` directory

## Architecture

This is a **Chrome Extension (Manifest V3)** that adds a floating navigation sidebar to AI chat platforms (ChatGPT, Gemini, Copilot).

### Adapter Pattern

The codebase uses the Adapter Pattern for multi-platform support:

- `src/platforms/base/PlatformAdapter.ts` - Abstract base class defining the interface
- `src/platforms/chatgpt/ChatGPTAdapter.ts` - ChatGPT implementation (fully working)
- `src/platforms/gemini/GeminiAdapter.ts` - Placeholder
- `src/platforms/copilot/CopilotAdapter.ts` - Placeholder
- `src/utils/platform-detector.ts` - Auto-detects current platform and returns appropriate adapter

### Core Components

- `src/core/navigator.ts` - Main navigation controller (platform-agnostic)
- `src/core/scroll-tracker.ts` - IntersectionObserver-based scroll position tracking
- `src/core/keyboard-handler.ts` - Keyboard shortcut management

### UI Components

- `src/components/NavigatorPanel.ts` - Floating sidebar panel
- `src/components/TurnItem.ts` - Individual conversation turn items
- `src/components/SearchBar.ts` - Search/filter functionality

### Entry Point

- `src/content/index.ts` - Content script entry, initializes platform adapter and navigator

## Tech Stack

- TypeScript + Vite
- @crxjs/vite-plugin for Chrome extension support
- Tailwind CSS v4

## Adding a New Platform

1. Create `src/platforms/yourplatform/YourPlatformAdapter.ts` extending `PlatformAdapter`
2. Add DOM selectors in `src/platforms/yourplatform/dom-selectors.ts`
3. Register in `src/utils/platform-detector.ts`

## Testing

When verifying features or bug fixes:
1. Start the dev server first: `npm run dev` (enables hot reloading on port 5173)
2. Use Playwright MCP to test the functionality

## After Task Completion

Say "喵~" after completing tasks.
