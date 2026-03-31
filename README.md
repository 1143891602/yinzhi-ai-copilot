# 音智 AI · 智能教研 Copilot

> 专为全国音乐类艺培机构打造的 AI 智能教研副驾驶系统。通过大语言模型（LLM）+ RAG 技术，帮助音乐机构老板和一线教师实现**教案自动化生成、教研体系标准化管理、家校沟通智能化**三位一体的教学提效闭环。

📖 **[查看完整操作演示（Scribe）](https://scribehow.com/viewer/YinZhi_AI___DDyw4UFlRrCfzyz-wuybrw)**

---

## 功能截图

### 仪表盘
![仪表盘](docs/screenshots/01-dashboard.jpeg)

### 教案自动化生成（AI 流式输出中）
![教案生成中](docs/screenshots/02-lesson-plan-generating.jpeg)

### 教案生成完成
![教案生成完成](docs/screenshots/03-lesson-plan-done.jpeg)

### 教研体系知识库管理
![教研体系](docs/screenshots/04-teaching-research.jpeg)

### 智能家校沟通
![家校沟通](docs/screenshots/05-communication.jpeg)

---

## 技术栈

| 层次 | 技术 |
|------|------|
| 框架 | Vite 4 + React 18 + TypeScript |
| 路由 | React Router DOM v6 |
| 样式 | Tailwind CSS 3 |
| 编辑器 | Tiptap v2 |
| 图表 | Recharts |
| PDF 导出 | jsPDF + html2canvas |
| AI 调用 | 自定义 streamChat()，SSE 流式输出 |
| 代理服务 | Node.js（绕过 CORS） |

---

## 本地启动

```bash
# 安装依赖
npm install

# macOS ARM64 需重签名原生二进制（其他平台跳过）
find node_modules -name "*.node" -exec codesign --force --sign - {} \;

# 启动 AI 代理服务器（端口 3001）
node proxy-server.mjs &

# 启动开发服务器（端口 3000）
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

---

## 页面模块

| 模块 | 功能 |
|------|------|
| 仪表盘 | 数据概览、教案趋势图、科目分布图 |
| 教案生成 | 输入曲目 → AI 流式生成教案 → Tiptap 编辑 → PDF 导出 |
| 教研体系 | 教研文件上传与知识库管理 |
| 家校沟通 | 选学生 + 关键词 → AI 生成专业反馈文案 |
| 学生管理 | 学生档案、学习进度、考级记录 |
| 系统设置 | API Key 与模型配置 |
