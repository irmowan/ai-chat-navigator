/**
 * Platform Detector
 * Detects current platform and creates appropriate adapter
 */
class PlatformDetector {
  /**
   * Detect current platform based on URL
   * @returns {string|null} Platform name or null if unsupported
   */
  static detect() {
    const hostname = window.location.hostname;

    // Check platforms in priority order
    if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
      return 'chatgpt';
    }

    if (hostname.includes('copilot.microsoft.com') || hostname.includes('m365.cloud.microsoft') || hostname.includes('copilot.cloud.microsoft')) {
      return 'copilot';
    }

    if (hostname.includes('gemini.google.com')) {
      return 'gemini';
    }

    console.warn('[AI Chat Navigator] Unknown platform:', hostname);
    return null;
  }

  /**
   * Create adapter instance for the given platform
   * @param {string} platformName - Platform name
   * @returns {PlatformAdapter} Adapter instance
   * @throws {Error} If no adapter found for platform
   */
  static createAdapter(platformName) {
    const adapters = {
      'chatgpt': ChatGPTAdapter,
      'copilot': CopilotAdapter,
      'gemini': GeminiAdapter,
    };

    const AdapterClass = adapters[platformName];
    if (!AdapterClass) {
      throw new Error(`No adapter found for platform: ${platformName}`);
    }

    return new AdapterClass();
  }

  /**
   * Check if current platform is supported
   * @returns {boolean}
   */
  static isSupported() {
    return this.detect() !== null;
  }

  /**
   * Get all supported platforms
   * @returns {string[]}
   */
  static getSupportedPlatforms() {
    return ['chatgpt', 'copilot', 'gemini'];
  }
}
