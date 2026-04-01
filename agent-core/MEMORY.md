# 音智 AI 项目核心记忆

## 项目概览
"音智 AI" 是一个专为音乐艺培机构打造的智能教研 Copilot 系统。它采用 Vite + React + TypeScript 技术栈，通过单文件打包（vite-plugin-singlefile）分发，零环境依赖运行。

## 技术规范
- **路由**: 必须使用 `HashRouter` (react-router-dom v6)。
- **样式**: Tailwind CSS + Framer Motion (用于动效) + Recharts (用于数据可视化)。
- **存储**: 所有业务数据（学生、教案、知识库、API 配置）均持久化在浏览器的 `localStorage` 中。
- **AI 接口**: 使用流式 Fetch 调用 OpenAI 兼容接口，支持用户在前端自定义 API URL 和 Key。

## 数据模型 (v2.0)
- **Student**: 包含基础信息及 `scores` 对象（五维能力评分）。
- **Lesson**: 存储在 `yinzhi_lessons`，包含 Tiptap HTML 内容。
- **Knowledge**: 存储在 `yinzhi_knowledge`，作为 RAG 检索的本地知识库。

## UI/UX 准则 (v2.1)
- **风格**: 玻璃拟态 (Glassmorphism)，背景高斯模糊 (backdrop-blur-xl)，32px 大圆角。
- **滚动**: 采用原生 Body 滚动，侧边栏 `fixed` 定位。
- **动画**: 使用 Framer Motion 的 `AnimatePresence` 处理页面级转场。

## 核心仓库
`https://github.com/1143891602/yinzhi-ai-copilot`
最新稳定版: V2.1.1 (滚动修复版)
