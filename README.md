# AI Turn Navigator

<p align="center">
  <img src="public/icons/icon128.png" alt="AI Turn Navigator" width="128" height="128">
</p>

<p align="center">
  <strong>Navigate long AI conversations with ease</strong>
</p>

<p align="center">
  A browser extension that adds a floating navigation sidebar to AI chat platforms, making it easy to jump between conversation turns.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#keyboard-shortcuts">Shortcuts</a> •
  <a href="#supported-platforms">Platforms</a>
</p>

---

## Features

- **Floating Sidebar** — A sleek navigation panel on the right side of your screen
- **Quick Navigation** — Click any turn to instantly jump to that part of the conversation
- **Visual Highlighting** — See exactly where you are with smooth highlight animations
- **Search & Filter** — Quickly find specific messages in long conversations
- **Auto-tracking** — The sidebar automatically follows your scroll position
- **Dark Mode** — Seamlessly adapts to your system and ChatGPT theme
- **Keyboard Shortcuts** — Navigate without touching your mouse

## Installation

### Option 1: Download from Releases (recommended)

1. Go to [Releases](https://github.com/irmowan/ai-chat-navigator/releases)
2. Download the latest `ai-chat-navigator-<version>.zip`
3. Unzip it to a local folder
4. Open Chrome and go to `chrome://extensions/`
5. Enable **Developer mode** (toggle in top right)
6. Click **Load unpacked**
7. Select the unzipped folder

### Option 2: Build from Source (Developer Mode)

1. Download or clone this repository
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
3. Open Chrome and go to `chrome://extensions/`
4. Enable **Developer mode** (toggle in top right)
5. Click **Load unpacked**
6. Select the `dist/` folder

## Usage

1. Go to [ChatGPT](https://chatgpt.com) and open any conversation
2. Look for the **`<`** button in the top-right toolbar
3. Click it to open the navigator sidebar
4. Each conversation turn shows a numbered preview of your message
5. Click any item to jump directly to that turn

<details>
<summary><strong>Tips for long conversations</strong></summary>

- Use the **search bar** to filter turns by keyword
- Press **`n`** to quickly toggle the sidebar
- The **green border** indicates your current position
- Turns are numbered (`#1`, `#2`, etc.) for easy reference

</details>

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `n` | Toggle navigator sidebar |
| `Ctrl/Cmd + ↑` | Go to previous turn |
| `Ctrl/Cmd + ↓` | Go to next turn |

## Supported Platforms

| Platform | Status |
|----------|--------|
| [ChatGPT](https://chatgpt.com) | ✅ Fully supported |
| [Gemini](https://gemini.google.com) | 🚧 Coming soon |
| [Copilot](https://copilot.microsoft.com) | 🚧 Coming soon |

## Screenshots

*Coming soon*

## Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

See [CLAUDE.md](CLAUDE.md) for detailed development documentation.

## Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## License

MIT

---

<p align="center">
  Made with ❤️ for AI power users
</p>
