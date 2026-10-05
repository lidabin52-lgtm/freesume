# FREESUME · 简历工作台

> AI驱动的简历工作台 · TRAE AI创造力大赛 Top 20 作品复刻

![status](https://img.shields.io/badge/status-active-brightgreen)
![tech](https://img.shields.io/badge/tech-HTML%2FCSS%2FJS-orange)
![ai](https://img.shields.io/badge/AI-Optional-blue)

## 🚀 功能特性

- **🎯 简历智能分析** - AI多维度深度分析，分区高亮显示，实时对话改进
- **🎯 岗位智能匹配** - JD适配预览，AI生成定制简历改写建议
- **🏢 大厂直达** - 200+知名公司官网一键直达
- **📊 投递全流程管理** - 状态追踪 + 复盘笔记（localStorage持久化）
- **🤖 可配置AI** - 支持接入OpenAI兼容API（Groq/硅基流动/OpenRouter等）
- **⚡ Chrome浏览器插件** - 网申页面一键自动填充简历信息

## 📂 项目结构

```
qiuzhi/
├── index.html              # 主页面（6个视图）
├── css/
│   └── style.css           # 完整样式表
├── js/
│   ├── app.js              # 核心逻辑（路由/CRUD/本地存储）
│   └── ai.js               # AI模块（可配置API + 智能Mock）
├── browser-extension/      # Chrome浏览器插件
│   ├── manifest.json
│   ├── popup.html          # 弹出面板
│   ├── popup.js            # 面板逻辑
│   ├── popup.css
│   ├── content.js          # 自动注入页面
│   ├── content.css
│   ├── background.js
│   └── icons/              # 插件图标
├── vercel.json             # Vercel部署配置
└── frames/                 # 视频分析帧（参考用）
```

## 💻 本地运行

```bash
# 方式一：Python（推荐，已验证可用）
cd qiuzhi
python -m http.server 8080
# 访问 http://localhost:8080

# 方式二：Node.js
npx serve .

# 方式三：直接用浏览器打开 index.html（部分功能可能受限）
```

## 🤖 配置真实AI（可选）

默认使用内置 **Mock AI** 回复（本地可用、无需联网）。要接入真实AI：

1. 打开网站 → 点击右上角 **⚙️ 设置按钮**
2. 填写 API Endpoint 和 API Key

### 推荐免费/低价方案

| 服务                 | Endpoint                                            | 模型                    | 费用                  |
| -------------------- | --------------------------------------------------- | ----------------------- | --------------------- |
| **Groq**       | `https://api.groq.com/openai/v1/chat/completions` | `llama3-8b-8192`      | 免费额度很大          |
| **硅基流动**   | `https://api.siliconflow.cn/v1/chat/completions`  | `Qwen2.5-7B-Instruct` | 国内快、¥1/百万token |
| **OpenRouter** | `https://openrouter.ai/api/v1/chat/completions`   | 多种可选                | 按量付费              |
| **OpenAI**     | `https://api.openai.com/v1/chat/completions`      | `gpt-4o-mini`         | $0.15/百万token       |

## 🔌 Chrome插件安装

1. 打开 Chrome → 访问 `chrome://extensions/`
2. 右上角开启 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择 `browser-extension` 文件夹
5. 点击插件图标 → 填写简历信息 → 保存
6. 访问任何网申页面（jobs.bytedance.com 等）→ 点击 **⚡ 一键填充**

## 🚀 部署上线（3种免费方案）

### 方案一：Vercel（最简单）

1. 访问 [vercel.com](https://vercel.com) 注册/登录
2. 点击 **Add New → Project** → **Continue**
3. **Import** 把整个 `qiuzhi` 文件夹拖拽上传
4. 等待部署完成 → 获得 `https://xxx.vercel.app` 地址

### 方案二：Netlify（支持拖放）

1. 访问 [app.netlify.com/drop](https://app.netlify.com/drop)
2. 把整个 `qiuzhi` 文件夹拖到页面上
3. 自动部署完成 → 获得 `https://xxx.netlify.app` 地址

### 方案三：GitHub Pages

```bash
cd qiuzhi
git init
git add .
git commit -m "init: FREESUME resume workspace"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
# GitHub仓库 → Settings → Pages → Source选 main 分支
```

## ✨ 已验证功能

| 功能         | 状态        | 说明                                       |
| ------------ | ----------- | ------------------------------------------ |
| 首页展示     | ✅ 已验证   | Hero + 功能卡片 + 数据统计                 |
| 简历分析对话 | ✅ 已验证   | AI对话、Markdown渲染、复制/删除            |
| 投递记录CRUD | ✅ 已验证   | 增删改查、状态筛选、详情弹窗、数据导出JSON |
| AI设置面板   | ✅ 已验证   | 可配置API、Mock降级                        |
| Chrome插件   | ⚠️ 已创建 | 结构完整但未实机测试                       |
| 大厂直达页面 | ✅ 静态展示 | 200+公司分类卡片                           |

## 📝 技术栈

- **前端**：原生 HTML5 + CSS3 + JavaScript（无框架依赖）
- **存储**：localStorage（纯前端持久化）
- **AI**：可配置 OpenAI 兼容 API
- **插件**：Chrome Manifest V3

## 📄 开源许可

MIT License - 自由使用、修改、分发
