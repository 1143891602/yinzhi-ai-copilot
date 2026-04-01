import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import {
  Bold, Italic, List, ListOrdered, Heading1, Heading2,
  Sparkles, Save, Download, Send, History, Settings2, GraduationCap, AlertCircle, Loader2, CheckCircle, BookOpen, ChevronLeft, Layout
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { streamChat } from '@/lib/ai'
import { saveLesson } from '@/lib/lessonStorage'
import { getKnowledgeSnippets } from '@/lib/knowledgeStorage'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null
  const btn = (active: boolean) =>
    cn('p-2 rounded-xl transition-all', active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600')
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-1">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}><Bold size={14} strokeWidth={3} /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}><Italic size={14} strokeWidth={3} /></button>
        <div className="w-px h-4 bg-slate-200 mx-2" />
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))}><Heading1 size={14} strokeWidth={3} /></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}><Heading2 size={14} strokeWidth={3} /></button>
        <div className="w-px h-4 bg-slate-200 mx-2" />
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}><List size={14} strokeWidth={3} /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}><ListOrdered size={14} strokeWidth={3} /></button>
      </div>
    </div>
  )
}

function mdToHtml(md: string): string {
  const lines = md.split('\n')
  const html: string[] = []
  let inUl = false
  for (const line of lines) {
    if (line.startsWith('# ')) {
      if (inUl) { html.push('</ul>'); inUl = false }
      html.push(`<h1>${line.slice(2)}</h1>`)
    } else if (line.startsWith('## ')) {
      if (inUl) { html.push('</ul>'); inUl = false }
      html.push(`<h2>${line.slice(3)}</h2>`)
    } else if (line.startsWith('### ')) {
      if (inUl) { html.push('</ul>'); inUl = false }
      html.push(`<h3>${line.slice(4)}</h3>`)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inUl) { html.push('<ul>'); inUl = true }
      html.push(`<li>${line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</li>`)
    } else if (/^\d+\.\s/.test(line)) {
      if (inUl) { html.push('</ul>'); inUl = false }
      const content = line.replace(/^\d+\.\s/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      html.push(`<p><strong>${line.match(/^\d+/)?.[0]}.</strong> ${content}</p>`)
    } else if (line.trim() === '') {
      if (inUl) { html.push('</ul>'); inUl = false }
      html.push('<br/>')
    } else {
      if (inUl) { html.push('</ul>'); inUl = false }
      html.push(`<p>${line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`)
    }
  }
  if (inUl) html.push('</ul>')
  return html.join('')
}

const INSTRUMENT_MAP: Record<string, string> = {
  '钢琴': '钢琴 (Piano)', '声乐': '声乐 (Vocal)', '古筝': '古筝 (Guzheng)',
  '小提琴': '小提琴 (Violin)', '吉他': '吉他 (Guitar)', '乐理': '乐理 (Theory)'
}
const LEVEL_MAP: Record<string, string> = {
  '初级': '初级 (Beginner)', '1 级': '1 级', '2 级': '2 级', '3 级': '3 级', '4 级': '4 级',
  '5 级': '5 级', '6 级': '6 级', '7 级': '7 级', '8 级': '8 级', '9 级': '9 级', '10 级': '10 级', '考级班': '考级班 (Exam Prep)'
}

export default function LessonPlan() {
  const [searchParams] = useSearchParams()
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: '在此编辑或使用左侧 AI 一键生成...' }), Underline, Highlight],
    content: '',
  })

  const [subject, setSubject] = useState('')
  const [instrument, setInstrument] = useState('钢琴 (Piano)')
  const [level, setLevel] = useState('初级 (Beginner)')
  const [duration, setDuration] = useState('45 分钟')
  const [phase, setPhase] = useState<'idle' | 'streaming' | 'done'>('idle')
  const [streamText, setStreamText] = useState('')
  const [error, setError] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [exporting, setExporting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fromStudent, setFromStudent] = useState('')
  const [fromPackage, setFromPackage] = useState(false)

  const streamBoxRef = useRef<HTMLDivElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const inst = searchParams.get('instrument') || searchParams.get('subject')
    const lv = searchParams.get('level')
    const student = searchParams.get('student')
    const topic = searchParams.get('topic')
    if (inst) setInstrument(INSTRUMENT_MAP[inst] || instrument)
    if (lv) setLevel(LEVEL_MAP[lv] || level)
    if (student) setFromStudent(student)
    if (topic) { setSubject(topic); setFromPackage(true) }
  }, [])

  useEffect(() => {
    if (streamBoxRef.current) {
      streamBoxRef.current.scrollTop = streamBoxRef.current.scrollHeight
    }
  }, [streamText])

  const buildPrompt = (topic: string) => {
    const snippets = getKnowledgeSnippets().filter(s => s.enabled)
    const context = snippets.length > 0 
      ? `\n参考以下机构教研标准：\n${snippets.map(s => `- ${s.title}: ${s.content}`).join('\n')}\n`
      : ''
    
    return `你是专业音乐教研专家，为"音智 AI"生成结构化教案。${context}\n\n课程主题：${topic}\n科目：${instrument}\n级别：${level}\n课时：${duration}\n\n请生成完整教案，使用 Markdown 格式，必须包含：\n# 教案标题\n## 一、教学目标\n## 二、重点与难点\n## 三、教学步骤\n## 四、课后练习\n\n直接输出内容，不要前言。`
  }

  const handleGenerate = async () => {
    if (!subject.trim()) { setError('请输入教案主题'); return }
    setError('')
    setPhase('streaming')
    setStreamText('')
    setSaved(false)

    await streamChat(
      [{ role: 'user', content: buildPrompt(subject) }],
      (chunk) => setStreamText(prev => prev + chunk),
      () => {
        setPhase('done')
        editor?.commands.setContent(mdToHtml(streamText))
      }
    )
  }

  const handleFollowUp = async () => {
    if (!followUp.trim() || phase === 'streaming') return
    const msg = followUp
    setFollowUp('')
    setPhase('streaming')
    setStreamText(editor?.getHTML() || '')

    await streamChat(
      [
        { role: 'user', content: buildPrompt(subject) },
        { role: 'assistant', content: editor?.getHTML() || '' },
        { role: 'user', content: `请基于以上内容进行修改：${msg}` }
      ],
      (chunk) => setStreamText(prev => prev + chunk),
      () => {
        setPhase('done')
        editor?.commands.setContent(mdToHtml(streamText))
      }
    )
  }

  const handleSave = () => {
    if (!editor) return
    saveLesson({
      title: subject,
      subject: instrument.split(' ')[0],
      level,
      duration,
      content: editor.getHTML()
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleExport() {
    if (!editorContainerRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(editorContainerRef.current, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`教案_${subject || '未命名'}.pdf`)
    } catch (err) {
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full overflow-hidden">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">教案自动化生成</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">基于教研大纲，AI 秒级产出标准化乐器教案。</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave} 
            disabled={!editor?.getHTML() || phase === 'streaming'}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border",
              saved ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95"
            )}
          >
            {saved ? <CheckCircle size={15} strokeWidth={3} /> : <Save size={15} strokeWidth={3} />}
            {saved ? '已保存到库' : '保存教案'}
          </button>
          <button 
            onClick={handleExport}
            disabled={!editor?.getHTML() || phase === 'streaming' || exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
          >
            {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} strokeWidth={3} />}
            导出 PDF
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* 左侧控制区 */}
        <div className="w-80 space-y-4 shrink-0 overflow-y-auto pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-7 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">教案主题 / 曲目</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                placeholder="如：莫扎特奏鸣曲 K.545"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">教学科目</label>
                <select value={instrument} onChange={(e) => setInstrument(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold outline-none appearance-none cursor-pointer">
                  {Object.values(INSTRUMENT_MAP).map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">针对级别</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold outline-none appearance-none cursor-pointer">
                  {Object.values(LEVEL_MAP).map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">预设课时</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold outline-none appearance-none cursor-pointer">
                {['30 分钟', '45 分钟', '60 分钟', '90 分钟'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={phase === 'streaming'}
              className={cn(
                'w-full flex items-center justify-center gap-2.5 py-4 rounded-[20px] font-black text-sm transition-all shadow-2xl relative overflow-hidden group',
                phase === 'streaming' 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]'
              )}
            >
              {phase === 'streaming' && (
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                />
              )}
              {phase === 'streaming' ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} strokeWidth={3} />}
              {phase === 'streaming' ? 'AI 正在构思...' : '一键生成教案'}
            </button>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600 font-bold"
                >
                  <AlertCircle size={14} strokeWidth={3} /> {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 rounded-[32px] p-7 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100/20"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-125 transition-transform duration-500">
              <GraduationCap size={80} />
            </div>
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className="p-1 bg-indigo-500/30 rounded-lg">
                <Sparkles size={14} className="text-indigo-300" />
              </div>
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">RAG 智能教研库</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed relative z-10 font-medium">
              已检索知识：<span className="text-slate-200">
                {getKnowledgeSnippets().filter(s => s.enabled).map(s => `《${s.title}》`).join('、') || '正在加载通用教研库...'}
              </span>
            </p>
          </motion.div>
        </div>

        {/* 右侧编辑器区 */}
        <div className="flex-1 flex flex-col bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden relative group">
          <AnimatePresence mode="wait">
            {phase === 'streaming' ? (
              <motion.div 
                key="streaming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                ref={streamBoxRef} 
                className="flex-1 overflow-y-auto p-12 font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/50"
              >
                <div className="flex items-center gap-3 mb-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 max-w-fit">
                  <Loader2 size={16} className="text-indigo-600 animate-spin" />
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">AI 副驾驶正在高速生成中...</span>
                </div>
                {streamText}
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-5 bg-indigo-500 ml-1 align-middle"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <MenuBar editor={editor} />
                <div ref={editorContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-12">
                  <EditorContent editor={editor} className="font-sans" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 底部交互区 */}
          <div className="p-4 bg-white border-t border-slate-50 relative z-10">
            <div className="bg-slate-50 rounded-2xl p-2.5 flex items-center gap-3 border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={18} className="text-indigo-500" />
              </div>
              <input 
                type="text" 
                value={followUp} 
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
                placeholder={phase === 'done' ? '告诉 AI 如何微调教案内容（按 Enter 发送）...' : '生成后在此与 AI 对话微调...'}
                className="flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-slate-300 text-slate-700 px-2"
                disabled={phase === 'streaming'} 
              />
              <button 
                onClick={handleFollowUp} 
                disabled={!followUp.trim() || phase === 'streaming'}
                className={cn(
                  'w-10 h-10 rounded-xl transition-all flex items-center justify-center shrink-0',
                  !followUp.trim() || phase === 'streaming' 
                    ? 'text-slate-300' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                )}
              >
                <Send size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
