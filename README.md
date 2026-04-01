# 音智 AI · 智能教研副驾驶 (V2.0 AI-Powered School OS)

> 专为全国音乐类艺培机构打造的 **AI 智能教研副驾驶系统**。V2.0 版本实现了从“教案生成器”到“智能教务大脑”的跨越，通过**学员能力雷达、工作流深度串联、RAG 知识库增强、数据全量备份**，为音乐机构提供全方位的 AI 提效解决方案。

📖 **[查看最新版本演示（Scribe）](https://scribehow.com/shared/AI_Copilot_v20_Workflow__xxx)**

---

## 🚀 V2.0 核心特性

### 1. 📊 学员能力五维雷达 (Student Intelligence)
- **可视化成长轨迹**：在学员档案中引入 Recharts 雷达图，涵盖**音准、节奏、表现力、识谱、勤奋度**五个核心维度。
- **AI 动态评分**：系统可根据历史课后评价自动更新能力模型，让教学进度一目了然。

### 2. 🧠 RAG 教研知识库增强 (Expert Knowledge Base)
- **私有教研投喂**：支持录入机构私有教学大纲、技巧秘籍。
- **精准检索生成**：AI 在生成教案时会自动检索关联知识点，生成的教案更符合机构自身教学风格。

### 3. 🔄 深度工作流串联 (Seamless Workflow)
- **跨场景预填**：从“大课包”一键跳转“单节教案”，再到“家校反馈”，所有参数（学员、课题、科目、级别）全流程自动流转。
- **AI 追问与微调**：生成教案后支持对话式修改，“把第二步改得更生动点”，即刻生效。

### 4. 🔒 数据安全与迁移 (Enterprise Grade Security)
- **全量数据备份**：支持一键导出所有教案、学员、设置到 JSON 文件。
- **零配置迁移**：换电脑、清缓存不再怕，一键上传备份文件即可瞬间还原。
- **隐私保护**：所有数据及 API Key 均存储在浏览器本地，绝不上传云端。

---

## 🛠️ 技术栈 (Tech Stack)

| 维度 | 技术实现 |
|------|---------|
| **前端框架** | React 18 + TypeScript + Vite 4 |
| **路由模式** | HashRouter (完美支持单文件本地打开) |
| **编辑器** | Tiptap (富文本编辑 + 实时预览) |
| **数据看板** | Recharts (雷达图 / 趋势图) |
| **导出方案** | jsPDF + html2canvas (高清 PDF 导出) |
| **AI 驱动** | SSE 流式输出 + 自定义 prompt 工程 |
| **分发模式** | **Single-File HTML** (打包后仅 ~1.9MB) |

---

## 📦 快速开始

1. **下载文件**：在 [Releases](https://github.com/1143891602/yinzhi-ai-copilot/releases) 页面下载最新的 `音智AI教研系统.html`。
2. **直接打开**：双击 HTML 文件，使用 Chrome 或 Edge 浏览器即可运行（无需安装 Node.js）。
3. **配置 API**：
   - 进入「系统设置」。
   - 填入您的 API Key（支持 OpenAI / DeepSeek / 智谱 / Moonshot 等）。
   - 点击「测试连接」，显示成功后即可解锁全站功能。

---

## 📜 开发者指南

如果您想参与开发，请确保您的环境满足以下条件：

```bash
# 克隆仓库
git clone https://github.com/1143891602/yinzhi-ai-copilot.git
cd yinzhi-ai-copilot

# 安装依赖
npm install

# 启动代理服务器 (处理 CORS)
node proxy-server.mjs &

# 启动开发服务器
npm run dev
```

**注意**：Vite 必须保持在 4.x 版本以确保兼容性。

---

## 📈 未来规划 (Roadmap)
- [ ] **AI 语音评价**：支持录音上传，AI 自动听音纠错。
- [ ] **多端同步**：基于 WebRTC 的本地多端同步。
- [ ] **教案视频化**：一键将教案生成短视频教学脚本。

---
Produced by **音智 AI 团队** · 赋能每一位音乐教育者
