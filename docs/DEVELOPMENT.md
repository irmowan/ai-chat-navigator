# 开发和测试指南

## 快速开始

### 1. 加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启「开发者模式」（右上角开关）
4. 点击「加载已解压的扩展程序」
5. 选择本项目文件夹
6. 确认扩展已加载成功（显示绿色图标）

### 2. 测试扩展

1. 访问 https://chatgpt.com
2. 开始一个新对话，发送几条消息
3. 观察页面右侧是否出现侧边栏
4. 测试各项功能

## 功能测试清单

### 基础功能

- [ ] 侧边栏自动出现
- [ ] 显示所有用户查询
- [ ] 查询序号正确显示
- [ ] 查询文本正确提取
- [ ] 长文本正确截断

### 交互功能

- [ ] 点击查询项能够正确定位
- [ ] 平滑滚动效果正常
- [ ] 目标查询高亮显示
- [ ] 当前位置自动追踪
- [ ] 搜索过滤功能正常
- [ ] 收起/展开按钮工作正常

### 性能测试

- [ ] 加载时间 < 500ms
- [ ] 定位响应时间 < 200ms
- [ ] 长对话（50+ 轮）性能正常
- [ ] 内存占用合理

### 兼容性测试

- [ ] ChatGPT 新对话页面
- [ ] ChatGPT 已有对话页面
- [ ] 浅色模式显示正常
- [ ] 暗色模式显示正常
- [ ] 不影响 ChatGPT 原有功能

## 调试技巧

### 查看日志

1. 在 ChatGPT 页面按 F12 打开开发者工具
2. 切换到 Console 标签
3. 过滤日志：搜索 `[ChatGPT Turn Navigator]`

### 常见日志

```
[ChatGPT Turn Navigator] Initializing...
[ChatGPT Turn Navigator] Started successfully
[ChatGPT Turn Navigator] Found X messages with selector: ...
[ChatGPT Turn Navigator] Added query #N: ...
[ChatGPT Turn Navigator] Sidebar created
[ChatGPT Turn Navigator] DOM observer started
[ChatGPT Turn Navigator] Scrolled to query #N
```

### 检查元素

1. 右键点击侧边栏 > 检查
2. 查看 `.ctf-sidebar` 元素
3. 检查样式是否正确应用

### 重新加载扩展

修改代码后：
1. 访问 `chrome://extensions/`
2. 找到 ChatGPT Turn Navigator
3. 点击「重新加载」按钮
4. 刷新 ChatGPT 页面

## 故障排除

### 侧边栏没有出现

**可能原因：**
- ChatGPT 页面结构变化
- 选择器不匹配

**解决方法：**
1. 打开控制台查看日志
2. 检查是否有错误信息
3. 使用开发者工具检查页面 DOM 结构
4. 更新 `content.js` 中的选择器

### 查询列表为空

**可能原因：**
- 消息选择器不正确
- 消息还未加载完成

**解决方法：**
1. 检查控制台日志中的 "Found X messages" 信息
2. 手动检查页面中的用户消息元素
3. 更新 `scanExistingQueries()` 中的选择器
4. 增加延迟时间：修改 `start()` 中的 `setTimeout` 延迟

### 定位不准确

**可能原因：**
- 元素引用失效
- 页面布局变化

**解决方法：**
1. 检查 `query.element` 是否存在
2. 确认元素在 DOM 中的位置
3. 调整 `scrollIntoView` 的参数

### 样式显示异常

**可能原因：**
- ChatGPT 样式冲突
- CSS 优先级问题

**解决方法：**
1. 检查元素的计算样式
2. 增加 CSS 选择器优先级
3. 使用 `!important`（谨慎使用）

## 性能优化

### 减少 DOM 查询

```javascript
// 不好的做法
document.querySelector('.ctf-list').innerHTML = '...';
document.querySelector('.ctf-list').innerHTML = '...';

// 好的做法
const list = document.querySelector('.ctf-list');
list.innerHTML = '...';
list.innerHTML = '...';
```

### 防抖滚动事件

已在代码中实现：
```javascript
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    this.updateCurrentPosition();
  }, 150);
}, { passive: true });
```

### 虚拟滚动（可选）

对于超长列表（>500 条），可以考虑实现虚拟滚动：
- 只渲染可见区域的列表项
- 动态加载/卸载 DOM 节点

## 代码贡献指南

### 代码风格

- 使用 2 空格缩进
- 使用 ES6+ 语法
- 添加必要的注释
- 保持函数简洁

### 提交规范

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 样式调整
refactor: 代码重构
perf: 性能优化
test: 添加测试
```

### Pull Request

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 打包发布

### 准备工作

1. 确保所有功能测试通过
2. 更新版本号（manifest.json）
3. 更新 CHANGELOG.md
4. 生成图标（PNG 格式）

### 打包

```bash
# 创建 zip 文件
zip -r chatgpt-turn-finder-v1.0.0.zip . -x "*.git*" "*.DS_Store" "node_modules/*" "*.md"
```

或者使用 Chrome 自带的打包功能：
1. 访问 `chrome://extensions/`
2. 点击「打包扩展程序」
3. 选择扩展根目录
4. 生成 .crx 文件

### 发布到 Chrome Web Store

1. 访问 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/devconsole)
2. 创建新项目
3. 上传 zip 文件
4. 填写商店信息
5. 提交审核

## 参考资料

- [Chrome Extension 官方文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 迁移指南](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
