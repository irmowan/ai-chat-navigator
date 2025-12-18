// ChatGPT Turn Navigator - Entry point

// Initialize extension when on ChatGPT
if (window.location.hostname.includes('chatgpt.com') || window.location.hostname.includes('chat.openai.com')) {
  const i18n = new I18n();
  const sidebar = new Sidebar(i18n);
  const navigator = new Navigator(i18n, sidebar);
  
  navigator.init();
  
  // Expose to window for debugging
  window.turnNavigator = { i18n, sidebar, navigator };
}

