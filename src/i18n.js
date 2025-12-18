// Internationalization module

class I18n {
  constructor() {
    this.language = this.detectLanguage();
  }

  // Detect user language
  detectLanguage() {
    // Try to get language from HTML lang attribute
    let lang = document.documentElement.lang;
    
    // Fallback to browser language
    if (!lang) {
      lang = navigator.language || navigator.userLanguage || 'en';
    }
    
    // Simplify to main language code (e.g., "zh-CN" -> "zh")
    lang = lang.split('-')[0].toLowerCase();
    
    // Only support zh and en
    return lang === 'zh' ? 'zh' : 'en';
  }

  // Get localized text
  getText(key) {
    const texts = {
      en: {
        title: 'Navigation',
        collapse: 'Collapse sidebar',
        expand: 'Expand navigation',
        search: 'Search...',
        resize: 'Drag to resize',
        empty: 'No queries yet',
        found: 'messages',
        foundFallback: 'messages with fallback method',
        added: 'Added query',
        notFound: 'Query',
        notFoundSuffix: 'not found',
        scrolled: 'Scrolled to query',
        created: 'Sidebar created',
        observerStarted: 'DOM observer started',
        buttonInserted: 'Expand button inserted to toolbar',
        buttonInsertedFallback: 'Expand button inserted (fallback method)',
        buttonInsertedContainer: 'Expand button inserted (fallback container)',
        shown: 'shown',
        hidden: 'hidden',
        urlChanged: 'URL changed, reloading queries...',
        urlChangedPolling: 'URL changed (polling), reloading queries...',
        reloaded: 'Reloaded queries for new conversation'
      },
      zh: {
        title: '对话导航',
        collapse: '收起侧边栏',
        expand: '展开对话导航',
        search: '搜索...',
        resize: '拖拽调整宽度',
        empty: '暂无查询记录',
        found: '条消息',
        foundFallback: '条消息（备用方法）',
        added: '已添加查询',
        notFound: '查询',
        notFoundSuffix: '未找到',
        scrolled: '已滚动到查询',
        created: '侧边栏已创建',
        observerStarted: 'DOM 监听已启动',
        buttonInserted: '展开按钮已插入到工具栏',
        buttonInsertedFallback: '展开按钮已插入（备用方法）',
        buttonInsertedContainer: '展开按钮已插入（降级方案）',
        shown: '已显示',
        hidden: '已隐藏',
        urlChanged: 'URL 已变化，重新加载查询...',
        urlChangedPolling: 'URL 已变化（轮询检测），重新加载查询...',
        reloaded: '已重新加载新对话的查询'
      }
    };
    
    return texts[this.language][key] || texts.en[key] || key;
  }
}
