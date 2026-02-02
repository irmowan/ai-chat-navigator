# Testing Guide for AI Turn Navigator

## Quick Start

### 1. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Navigate to: `C:\Users\yimwan\code\personal\ai-turn-navigator\dist`
5. Click "Select Folder"

The extension should now appear in your extensions list.

### 2. Test on ChatGPT

1. Navigate to https://chatgpt.com
2. Log in if needed
3. Start a new conversation or open an existing one
4. You should see the navigator panel appear on the right side of the screen

### 3. Create Test Data

To properly test the navigator, create a conversation with multiple turns:

```
User: What is TypeScript?
[Wait for response]

User: How do I install it?
[Wait for response]

User: Can you show me an example?
[Wait for response]

User: What are the benefits?
[Wait for response]

User: How does it compare to JavaScript?
[Wait for response]
```

### 4. Test Features

#### Basic Navigation
- ✅ Verify the navigator panel appears on the right side
- ✅ Check that each conversation turn is listed
- ✅ Confirm the first 50 characters of each user question are shown
- ✅ Click on a turn item - page should smooth scroll to that position
- ✅ Clicked message should have a green highlight that fades after 2 seconds

#### Auto-Positioning
- ✅ Manually scroll the page up and down
- ✅ Verify the corresponding turn item in the navigator is highlighted
- ✅ The active turn should have a green background in the navigator

#### Search/Filter
- ✅ Click on the search box at the top of the navigator
- ✅ Type a keyword (e.g., "TypeScript")
- ✅ Verify only matching conversation turns are shown
- ✅ Clear the search - all turns should reappear

#### Keyboard Shortcuts
- ✅ Press `Ctrl+↓` (or `Cmd+↓` on Mac) - should jump to next turn
- ✅ Press `Ctrl+↑` (or `Cmd+↑` on Mac) - should jump to previous turn
- ✅ Press `n` - should collapse the navigator to a thin strip
- ✅ Press `n` again - should expand the navigator

#### Collapse/Expand
- ✅ Click the `−` button in the header - panel should collapse
- ✅ Click the `+` button - panel should expand
- ✅ Refresh the page - collapsed state should persist

#### Dark Mode
- ✅ Switch ChatGPT to dark mode (if available)
- ✅ Verify navigator colors adapt to dark theme
- ✅ Check text is readable in both light and dark modes

## Using Playwright for Automated Testing

If you have Playwright MCP tools available, use these commands:

### 1. Navigate to ChatGPT
```javascript
await browser_navigate('https://chatgpt.com');
```

### 2. Take a Snapshot
```javascript
await browser_snapshot();
// Look for the navigator panel in the output
```

### 3. Take a Screenshot
```javascript
await browser_take_screenshot({
  filename: 'chatgpt-navigator.png',
  fullPage: true
});
```

### 4. Check Console Logs
```javascript
await browser_console_messages({ level: 'info' });
// Look for messages like:
// [AI Navigator] Content script loaded
// [AI Navigator] Detected platform: ChatGPT
// [AI Navigator] Parsed X conversation turns
// [AI Navigator] Successfully initialized
```

### 5. Test Click Interaction
```javascript
// First get a snapshot to find turn item refs
await browser_snapshot();

// Click on a turn item
await browser_click({
  ref: 'ai-nav-turn-item-ref',
  element: 'turn item'
});
```

### 6. Test Search
```javascript
await browser_type({
  ref: 'search-input-ref',
  text: 'TypeScript',
  element: 'search box'
});
```

## Debugging

### Console Messages

Open browser DevTools (F12) and check the Console tab for:

**Successful initialization:**
```
[AI Navigator] Content script loaded
[AI Navigator] Detected platform: ChatGPT
[AI Navigator] Parsed 5 conversation turns
[AI Navigator] Started observing DOM changes
[AI Navigator] Successfully initialized
```

**Errors to watch for:**
```
[AI Navigator] No supported platform detected
[AI Navigator] Conversation container not found
[AI Navigator] No message elements found
[AI Navigator] Cannot observe: container not found
```

### DOM Inspection

Use DevTools Elements tab to verify:
1. Navigator panel exists: Look for `<div class="ai-nav-panel">`
2. Turn items are rendered: Look for `<div class="ai-nav-turn-item">`
3. Data attributes are set: Check `data-turn-id` on message elements

### Common Issues

#### Navigator doesn't appear
- Check if ChatGPT has changed their DOM structure
- Look for console errors
- Verify the extension is enabled in `chrome://extensions/`
- Check that you're on a supported URL (chatgpt.com or chat.openai.com)

#### Turns not detected
- Wait a few seconds for the page to fully load
- Check console for "Parsed X conversation turns" message
- Verify there are actual user messages in the conversation
- Try refreshing the page

#### Keyboard shortcuts don't work
- Make sure focus is not in an input field
- Try clicking on the page background first
- Check if another extension is intercepting the keys

#### Styles look broken
- Check if Tailwind CSS loaded properly
- Look for CSS files in DevTools Network tab
- Verify `content-*.css` file exists in dist/assets/

## Manual DOM Inspection Test

If the navigator isn't working, manually test the DOM selectors:

1. Open DevTools Console
2. Run these commands:

```javascript
// Check if main container exists
document.querySelector('main');

// Check for conversation groups
document.querySelectorAll('[data-testid^="conversation-turn"]');
document.querySelectorAll('article');

// Check for user messages
document.querySelectorAll('[data-message-author-role="user"]');

// Check for AI responses
document.querySelectorAll('[data-message-author-role="assistant"]');
```

If any of these return empty, ChatGPT's structure has changed and selectors need updating.

## Expected Behavior

### Visual Appearance

**Light Mode:**
- White background panel
- Gray border on the left
- Light gray hover states
- Green active item background
- Black text

**Dark Mode:**
- Dark gray background panel
- Darker border
- Lighter hover states
- Dark green active item background
- White text

### Interactions

**Smooth Scrolling:**
- Clicking a turn should smoothly scroll (not jump)
- Takes about 0.5-1 second to complete

**Highlight Effect:**
- 2-second pulse animation
- Green outline around the message
- Fades out smoothly

**Search:**
- Real-time filtering as you type
- Case-insensitive matching
- Searches user question text only

## Performance Checks

- ✅ Navigator loads within 1 second of page load
- ✅ No noticeable lag when scrolling
- ✅ Search responds instantly (< 100ms)
- ✅ New messages are detected automatically
- ✅ No memory leaks (check Task Manager after extended use)

## Next Steps

After verifying ChatGPT works:
1. Test on different ChatGPT conversation lengths (short, medium, very long)
2. Test with conversations that have code blocks, images, etc.
3. Consider testing on Gemini or Copilot (adapters are placeholders)
4. Add icon files for a polished look

## Reporting Issues

If you find bugs, note:
1. Browser version
2. Operating system
3. Console error messages
4. Screenshots of the issue
5. Steps to reproduce
