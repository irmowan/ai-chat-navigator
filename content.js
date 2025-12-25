// AI Chat Navigator - Entry point
// Supports multiple AI chat platforms: ChatGPT, Copilot, Gemini

(function() {
  'use strict';

  // Detect platform
  const platformName = PlatformDetector.detect();

  if (!platformName) {
    console.warn('[AI Chat Navigator] Current platform is not supported');
    return;
  }

  console.log(`[AI Chat Navigator] Detected platform: ${platformName}`);

  try {
    // Create platform adapter
    const adapter = PlatformDetector.createAdapter(platformName);

    // Initialize core modules
    const i18n = new I18n();
    const sidebar = new Sidebar(i18n, platformName, adapter);
    const navigator = new Navigator(i18n, sidebar, adapter);

    // Expose to window for debugging
    window.aiChatNavigator = {
      platform: platformName,
      adapter,
      i18n,
      sidebar,
      navigator
    };

    console.log(`[AI Chat Navigator] Initialized successfully for ${platformName}`);

    // Start the navigator
    navigator.init();
  } catch (error) {
    console.error('[AI Chat Navigator] Initialization failed:', error);
  }
})();


