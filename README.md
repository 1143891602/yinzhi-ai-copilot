# 音智 AI · 智能教研 Copilot

> 专为全国音乐类艺培机构打造的 AI 智能教研副驾驶系统。通过大语言模型（LLM）+ RAG 技术，帮助音乐机构老板和一线教师实现**教案自动化生成、教研体系标准化管理、家校沟通智能化**三位一体的教学提效闭环。

---

## 功能演示

> 完整操作流程由 Scribe 录制 👇

📖 **[点击查看完整演示教程](https://scribehow.com/viewer/YinZhi_AI___DDyw4UFlRrCfzyz-wuybrw)**

### 教案生成

![创建新教案](https://colony-recorder.s3.amazonaws.com/files/2026-03-31/a7382722-6fdc-499a-8003-f5a988d9c7e0/ascreenshot.jpeg)

![一键生成教案](https://colony-recorder.s3.amazonaws.com/files/2026-03-31/0194c131-819e-45d2-88bb-607d83b67acc/ascreenshot.jpeg)

![AI 流式输出教案内容](https://colony-recorder.s3.amazonaws.com/files/2026-03-31/ae31d882-e8e9-42d3-b825-b7ef9aa6d98d/ascreenshot.jpeg)

### 教研体系

![上传教研文件](https://colony-recorder.s3.amazonaws.com/files/2026-03-31/24d003fd-7454-4d7f-a93f-ee036f715d8c/ascreenshot.jpeg)

![知识库文件管理](https://colony-recorder.s3.amazonaws.com/files/2026-03-31/30dc2339-e536-4771-bdbf-1fe09e2807b0/ascreenshot.jpeg)

### 家校沟通

![选择学生和科目](https://colony-recorder.s3.amazonaws.com/files/2026-03-31/c86ad620-c0d1-4fcc-a074-d0afdd70cdaa/ascreenshot.jpeg)

![生成专业反馈文案](https://colony-recorder.s3.amazonaws.com/files/2026-03-31/14afa860-d149-4fec-b700-1e03f96c1ea8/ascreenshot.jpeg)

![AI 流式输出家校沟通内容](https://colony-recorder.s3.amazonaws.com/files/2026-03-31/0bd0a60d-bae1-4e9f-a71d-40a18df84eda/ascreenshot.jpeg)

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
