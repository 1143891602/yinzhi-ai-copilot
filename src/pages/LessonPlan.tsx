import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Wand2, Save, Download, Layers, History } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { useSearchParams } from 'react-router-dom'
import { streamChat } from '@/lib/ai'
import { saveLesson } from '@/lib/lessonStorage'
import { getKnowledgeSnippets, type KnowledgeSnippet } from '@/lib/knowledgeStorage'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const SUBJECTS = ['钢琴', '声乐', '古筝', '小提琴', '吉他', '架子鼓', '视唱练耳']
const LEVELS = ['启蒙', '初级', '中级', '高级', '考级(1-10级)']

export default function LessonPlan() {
  const [searchParams] = useSearchParams()
  const [subject, setSubject] = useState(searchParams.get('subject') || '钢琴')
  const [level, setLevel] = useState(searchParams.get('level') || '初级')
  const [topic, setTopic] = useState(searchParams.get('title') || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showConfig, setShowConfig] = useState(true)

  const editorContainerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Placeholder.configure({
        placeholder: '在此输入或由 AI 自动生成教案内容...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[620px] p-12 focus:outline-none',
      },
    },
  })

  // 如果是从参数跳转来的，且有内容，填充
  useEffect(() => {
    if (editor && searchParams.get('title')) {
      // 可以在这里根据参数做一些初始化的事
    }
  }, [editor, searchParams])

  const generate = async () => {
    if (!topic || !editor) return
    setIsGenerating(true)
    setShowConfig(false)
    editor.commands.setContent('')

    const knowledgeList = getKnowledgeSnippets()
    const contextStr = knowledgeList.map((k: KnowledgeSnippet) => `[${k.category}] ${k.content}`).join('\n')

    const prompt = `你是一位资深的音乐教育专家。请为我生成一份专业的${subject}教案。
    课程主题：${topic}
    学生级别：${level}

    要求：
    1. 结构清晰：包含教学目标、重点难点、教学过程、课后练习。
    2. 专业性强：体现音乐核心素养，注重乐感和技术细节。
    3. 启发式教学：包含互动提问和趣味性设计。
    4. 结合参考知识：${contextStr || '暂无特定参考'}

    请直接开始生成教案正文。使用 Markdown 格式（H1, H2, 列表等）。`

    let fullText = ''
    try {
      await streamChat([{ role: 'user', content: prompt }], (chunk) => {
        fullText += chunk
        editor.commands.setContent(fullText)
      })
    } catch (error) {
      console.error(error)
      editor.commands.setContent('抱歉，生成过程中遇到了错误，请检查 API 配置。')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!editor || isSaving) return
    setIsSaving(true)
    const content = editor.getHTML()
    const title = topic || '未命名教案'

    try {
      saveLesson({ title, subject, level, content, duration: '45分钟' })
      alert('教案已成功保存至本地库')
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async () => {
    if (!editorContainerRef.current || isExporting) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(editorContainerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`音智AI教案-${topic || '导出'}.pdf`)
    } catch (e) {
      console.error('PDF 导出失败:', e)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-20 pt-4 lg:px-6">
      <section className="premium-glass relative overflow-hidden px-8 py-10 lg:px-10">
        <div className="absolute left-[8%] top-6 h-24 w-24 rounded-full bg-premium-purple/12 blur-3xl animate-breathe-slow" />
        <div className="absolute right-[10%] top-10 h-20 w-20 rounded-full bg-sky-300/20 blur-3xl animate-float-slow" />
        <div className="relative z-10 flex flex-col gap-4">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <div className="secondary-glass flex h-14 w-14 items-center justify-center rounded-[22px] bg-white/75">
              <Wand2 className="text-premium-purple" size={22} />
            </div>
            <div>
              <p className="mono-label text-slate-400">Lesson generator</p>
              <h1 className="section-title text-[2.6rem]">
                教研<span className="font-black">生成.</span>
              </h1>
            </div>
          </motion.div>
          <p className="max-w-2xl text-[16px] leading-8 text-slate-500">
            把复杂的备课过程，折叠进一块明亮、轻盈、可持续编辑的工作台里。
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`premium-glass lg:col-span-4 p-8 transition-all duration-500 ${!showConfig ? 'opacity-75' : ''}`}
        >
          <div className="space-y-8">
            <div>
              <p className="mono-label mb-4 text-slate-400">科目领域 / Category</p>
              <div className="grid grid-cols-3 gap-2">
                {SUBJECTS.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`rounded-2xl px-3 py-3 text-[11px] font-semibold transition-all duration-300 ${
                      subject === s
                        ? 'bg-premium-purple text-white shadow-glow'
                        : 'bg-white/70 text-slate-500 border border-white/80 hover:text-slate-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mono-label mb-4 text-slate-400">教学级别 / Level</p>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.slice(0, 4).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`rounded-2xl px-3 py-3 text-[11px] font-semibold transition-all duration-300 ${
                      level === l
                        ? 'bg-slate-900 text-white shadow-soft'
                        : 'bg-white/70 text-slate-500 border border-white/80 hover:text-slate-800'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mono-label mb-4 text-slate-400">课题主题 / Topic</p>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="在此输入课程主题，例如：肖邦夜曲..."
                className="min-h-[150px] w-full rounded-[28px] border border-white/90 bg-white/72 p-5 text-[14px] leading-7 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-premium-purple/35 focus:shadow-[0_14px_32px_rgba(110,44,242,0.10)]"
              />
            </div>
          </div>

          <button onClick={generate} disabled={isGenerating || !topic} className="apple-btn mt-8 w-full">
            {isGenerating ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <>
                <Sparkles size={18} strokeWidth={2.8} /> 开始智能生成
              </>
            )}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8 space-y-5">
          <div className="premium-glass overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200/80 px-8 py-5">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${isGenerating ? 'bg-premium-purple animate-pulse' : 'bg-slate-300'}`} />
                <span className="mono-label text-slate-400">
                  {isGenerating ? '正在温暖地构思教案...' : '教研工作台已就绪'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} className="btn-futuristic h-11 w-11 rounded-2xl p-0">
                  <Save size={16} />
                </button>
                <button onClick={handleExport} className="btn-futuristic h-11 w-11 rounded-2xl p-0">
                  <Download size={16} />
                </button>
                <button onClick={() => setShowConfig(true)} className="btn-futuristic h-11 w-11 rounded-2xl p-0">
                  <History size={16} />
                </button>
              </div>
            </div>

            <div ref={editorContainerRef} className="relative min-h-[720px] overflow-y-auto bg-white/45 no-scrollbar">
              <EditorContent editor={editor} />
              
              {isGenerating && (
                <div className="absolute bottom-10 left-12 flex items-center gap-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        className="h-1.5 w-1.5 rounded-full bg-premium-purple"
                      />
                    ))}
                  </div>
                  <span className="mono-label text-[10px] text-premium-purple/70">AI 正在构思音乐细节...</span>
                </div>
              )}

              {!editor?.getText() && !isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                  <div className="secondary-glass flex h-24 w-24 items-center justify-center rounded-[30px] bg-white/70">
                    <Layers size={36} strokeWidth={1.4} />
                  </div>
                  <p className="mono-label mt-8 text-slate-400">等待教案内容智能生成...</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
