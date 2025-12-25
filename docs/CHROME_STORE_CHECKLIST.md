# Chrome Web Store 发布准备清单

本文档列出了将 ChatGPT Turn Navigator 发布到 Chrome Web Store 之前需要完成的所有任务。

## 📋 发布前必须完成项

### 1. 法律文档

#### LICENSE 文件
- [ ] 创建 LICENSE 文件
- [ ] 确认使用 MIT 协议（与 package.json 声明一致）
- [ ] 填写正确的年份和作者信息

#### 隐私政策 (Privacy Policy)
- [ ] 创建 PRIVACY.md 或 privacy-policy.html
- [ ] 说明插件不收集任何用户数据
- [ ] 说明使用 Chrome Storage API 仅用于本地存储用户偏好设置
- [ ] 提供联系方式
- [ ] 部署到可公开访问的 URL（GitHub Pages 或其他）

#### 服务条款 (Terms of Service)
- [ ] 创建基本的使用条款文档
- [ ] 说明插件使用限制和免责声明
- [ ] 部署到可公开访问的 URL

### 2. Manifest.json 完善

- [ ] 添加 `author` 字段
- [ ] 添加 `homepage_url` 字段
- [ ] 添加 `short_name`（建议 12 字符以内）
- [ ] 扩展 `description` 到 100-132 字符，更详细描述功能
- [ ] 确认 `version` 号符合语义化版本规范
- [ ] 检查所有必需权限是否声明正确

**建议的 manifest.json 更新：**
```json
{
  "short_name": "ChatGPT Nav",
  "author": "Your Name",
  "homepage_url": "https://github.com/irmowan/chatgpt-turn-navigator",
  "description": "Navigate ChatGPT conversations efficiently with a smart sidebar. Quickly jump between user queries, search history, and track your position in long chats."
}
```

### 3. 图标和视觉素材

#### 扩展图标（已有）
- [x] icon16.png (16x16)
- [x] icon48.png (48x48)
- [x] icon128.png (128x128)
- [ ] 确认图标符合 Chrome 设计规范（清晰、专业、品牌一致）

#### Store 宣传素材（必需）
- [ ] 至少 1 张截图（必需，建议 3-5 张）
  - 尺寸：1280x800 或 640x400
  - PNG 或 JPEG 格式
  - 展示核心功能
- [ ] 小型推广图片（可选但推荐）
  - 尺寸：440x280
  - 用于 Chrome Web Store 推广展示

#### 推荐的截图内容
1. 显示侧边栏和对话列表的全屏截图
2. 搜索功能使用演示
3. 深色模式效果
4. 调整侧边栏宽度的演示
5. 高亮当前位置的效果

### 4. 文档完善

#### README.md
- [ ] 更新安装说明（添加 Chrome Web Store 链接占位符）
- [ ] 添加更详细的功能说明和使用案例
- [ ] 添加常见问题 (FAQ) 部分
- [ ] 添加隐私政策和服务条款链接
- [ ] 添加支持和反馈渠道

#### Store 页面描述
- [ ] 准备详细的产品描述（英文版）
- [ ] 准备详细的产品描述（中文版，如果适用）
- [ ] 突出核心价值和使用场景
- [ ] 包含关键特性列表

## 🔧 强烈建议完成项

### 5. 国际化 (i18n)

- [ ] 确认 src/i18n.js 完整支持的语言
- [ ] 测试所有界面文本在不同语言下的显示
- [ ] Store 页面提供多语言描述
- [ ] 考虑添加更多语言支持（如西班牙语、日语等）

### 6. 用户体验优化

- [ ] 考虑添加 options_page（设置页面）
  - 自定义侧边栏默认状态
  - 自定义主题偏好
  - 搜索行为设置
- [ ] 添加首次使用引导或欢迎提示
- [ ] 添加快捷键支持（可选）
- [ ] 改进错误提示和用户反馈

### 7. 技术质量保证

#### 测试覆盖
- [ ] 在 Chrome 最新稳定版测试
- [ ] 在 Chrome Beta 版测试
- [ ] 在 Windows 系统测试
- [ ] 在 macOS 系统测试
- [ ] 在 Linux 系统测试
- [ ] 测试不同屏幕分辨率下的显示

#### 边界情况处理
- [ ] 超长对话的性能测试（100+ 轮对话）
- [ ] 网络异常情况处理
- [ ] ChatGPT 页面结构变化的容错处理
- [ ] 快速切换对话时的状态管理

#### 代码质量
- [ ] 添加错误边界和异常捕获
- [ ] 确认没有 console.log 等调试代码
- [ ] 代码压缩和优化（减小包体积）
- [ ] 添加 CSP (Content Security Policy) 配置

### 8. 性能优化

- [ ] 检查内存泄漏
- [ ] 优化 DOM 操作性能
- [ ] 优化事件监听器（使用事件委托）
- [ ] 图片资源优化
- [ ] 考虑懒加载和节流/防抖

## 🌟 加分项

### 9. 品牌和营销

- [ ] 设计专业的品牌 logo
- [ ] 创建产品演示视频（YouTube）
- [ ] 准备产品亮点和卖点文案
- [ ] 设置社交媒体账号（Twitter、Reddit 等）
- [ ] 准备发布后的推广计划

### 10. 高级功能（可选）

- [ ] 添加导出对话功能
- [ ] 添加书签/收藏功能
- [ ] 添加对话统计信息
- [ ] 支持键盘快捷键导航
- [ ] 添加自定义主题

### 11. 分析和反馈

- [ ] 考虑集成匿名使用统计（需在隐私政策中说明）
- [ ] 设置错误追踪系统（如 Sentry）
- [ ] 准备用户反馈收集机制
- [ ] 设置问题追踪流程

### 12. 发布后计划

- [ ] 准备更新日志模板
- [ ] 制定版本更新策略
- [ ] 准备用户支持响应模板
- [ ] 监控用户评价和反馈
- [ ] 定期更新和维护计划

## 📝 Chrome Web Store 提交信息准备

### 开发者信息
- [ ] 注册 Chrome Web Store 开发者账号（需支付 5 美元注册费）
- [ ] 准备开发者信息和联系方式
- [ ] 准备付费验证材料（如需要）

### 商店页面信息
```
名称: ChatGPT Turn Navigator
分类: 生产力工具
语言: 英语（可添加更多）
隐私政策 URL: [待填写]
```

### 详细描述模板
```
[准备一个 400-1000 字的详细描述，包括：]
- 产品介绍
- 核心功能
- 使用场景
- 安装和使用说明
- 隐私和安全说明
- 支持信息
```

## ⚠️ 发布注意事项

### 审核要求
- 确保不违反 Chrome Web Store 政策
- 不包含恶意代码或误导性功能
- 明确说明权限使用目的
- 提供准确的功能描述
- 响应式设计，适配不同屏幕

### 常见拒审原因
- 隐私政策缺失或不完整
- 功能描述与实际不符
- 请求了不必要的权限
- 包含未声明的功能
- 图标或截图质量低

### 审核时间
- 首次提交：通常 1-3 个工作日
- 更新提交：通常几小时到 1 天

## ✅ 提交前最终检查清单

- [ ] 所有必需文件已创建
- [ ] Manifest.json 信息完整
- [ ] 隐私政策已部署并可访问
- [ ] 截图已准备（至少 1 张，建议 3-5 张）
- [ ] 图标符合规范
- [ ] 在本地完整测试
- [ ] 代码已清理和优化
- [ ] 文档已更新
- [ ] 版本号已确认
- [ ] 打包文件已生成（.zip）
- [ ] 开发者账号已注册

## 📦 打包和提交

### 打包步骤
```bash
# 1. 清理不必要的文件
# 删除 .git, node_modules, .github, docs, scripts 等开发文件

# 2. 创建发布目录
mkdir release
cp -r icons manifest.json content.js sidebar.css src release/

# 3. 压缩为 zip 文件
cd release
zip -r ../chatgpt-turn-navigator-v1.0.0.zip *
```

### 提交流程
1. 访问 Chrome Web Store Developer Dashboard
2. 上传 zip 包
3. 填写商店页面信息
4. 上传图标和截图
5. 设置定价和分发区域
6. 提交审核

## 📞 支持和联系

- GitHub Issues: https://github.com/irmowan/chatgpt-turn-navigator/issues
- Email: [待填写]
- 更新日志: [待创建]

---

**最后更新时间**: 2025-12-18
**文档版本**: 1.0.0
