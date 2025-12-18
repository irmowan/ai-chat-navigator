# ChatGPT Turn Navigator

A Chrome extension that adds a navigation sidebar to ChatGPT conversations, helping you quickly jump between user queries in long conversations.

## Features

- 🔍 **Quick Navigation**: Sidebar displays all user queries in the current conversation
- 🎯 **Smart Scrolling**: Automatically tracks your current position and highlights the active query
- 🔎 **Search**: Filter queries with real-time search
- 📏 **Resizable**: Drag to adjust sidebar width to your preference
- 🌓 **Dark Mode**: Automatically adapts to system theme
- 💾 **Persistent State**: Remembers sidebar visibility and width across sessions
- ⚡ **Performance**: Lightweight and fast, no impact on ChatGPT performance

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/irmowan/chatgpt-turn-navigator.git
   cd chatgpt-turn-navigator
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked" and select the extension directory

5. The extension will be installed and active on ChatGPT pages

### From Chrome Web Store

Coming soon...

## Usage

1. Open any ChatGPT conversation at https://chatgpt.com
2. The navigation sidebar will appear on the right side
3. Click any query in the sidebar to jump to that message
4. Use the search box to filter queries
5. Click the collapse button (▶) to hide the sidebar
6. Click the expand button (◀) in the header to show it again
7. Drag the left edge of the sidebar to resize it

## Development

### Project Structure

```
chatgpt-turn-navigator/
├── manifest.json       # Extension manifest
├── content.js          # Main content script
├── sidebar.css         # Sidebar styles
├── icons/              # Extension icons
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/yourusername/chatgpt-turn-navigator/issues).
