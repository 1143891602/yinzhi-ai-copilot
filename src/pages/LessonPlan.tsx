import { useState, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import {
  Bold, Italic, List, ListOrdered, Heading1, Heading2,
  Sparkles, Save, Download, Send, History, Settings2, GraduationCap, AlertCircle, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { streamChat } from '@/lib/ai'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null
  const btn = (active: boolean) =>
    cn('p-2 rounded-lg transition-all', active ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100')
  return (
    <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-0.5">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}><Bold size={15} /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}><Italic size={15} /></button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))}><Heading1 size={15} /></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}><Heading2 size={15} /></button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}><List size={15} /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}><ListOrdered size={15} /></button>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><Save size={15} /></button>
        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><Download size={15} /></button>
      </div>
    </div>
  )
}

// Minimal markdown → HTML
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
      html.push(`<p>${line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`)
    } else if (line.trim() === '') {
      if (inUl) { html.push('</ul>'); inUl = false }
    } else {
      if (inUl) { html.push('</ul>'); inUl = false }
      html.push(`<p>${line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`)
    }
  }
  if (inUl) html.push('</ul>')
  return html.join('')
}

export default function LessonPlan() {
  const [phase, setPhase] = useState<'idle' | 'streaming' | 'done'>('idle')
  const [streamText, setStreamText] = useState('')
  const [error, setError] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [exporting, setExporting] = useState(false)
  const [subject, setSubject] = useState('莫扎特奏鸣曲 K.545')
  const [instrument, setInstrument] = useState('钢琴 (Piano)')
  const [level, setLevel] = useState('中级 (4-6 级)')
  const [duration, setDuration] = useState('45 分钟')
  const rawRef = useRef('')
  const streamBoxRef = useRef<HTMLDivElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Placeholder.configure({ placeholder: '教案内容将在这里生成...' }),
    ],
    content: '',
    editorProps: { attributes: { class: 'tiptap' } },
  })

  const handleExport = async () => {
    if (!editorContainerRef.current || phase !== 'done') return
    setExporting(true)
    try {
      const el = editorContainerRef.current
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      const pageHeight = pdf.internal.pageSize.getHeight()
      let position = 0
      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      } else {
        // Multi-page
        while (position < pdfHeight) {
          pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight)
          position += pageHeight
          if (position < pdfHeight) pdf.addPage()
        }
      }
      pdf.save(`${subject}-教案.pdf`)
    } catch (e) {
      console.error(e)
    }
    setExporting(false)
  }

  const buildPrompt = (topic: string) =>
    `你是专业音乐教研专家，为"音智 AI"生成结构化教案。\n\n课程主题：${topic}\n科目：${instrument}\n级别：${level}\n课时：${duration}\n\n请生成完整教案，使用 Markdown 格式，必须包含：\n# 教案标题\n## 一、教学目标\n## 二、重点与难点\n## 三、教学步骤\n## 四、课后练习\n\n直接输出内容，不要前言。`

  const handleGenerate = async () => {
    if (phase === 'streaming') return
    setPhase('streaming')
    setStreamText('')
    setError('')
    rawRef.current = ''

    try {
      await streamChat(
        [{ role: 'user', content: buildPrompt(subject) }],
        (chunk) => {
          rawRef.current += chunk
          setStreamText(rawRef.current)
          if (streamBoxRef.current) {
            streamBoxRef.current.scrollTop = streamBoxRef.current.scrollHeight
          }
        },
        () => {
          // Load final content into editor
          editor?.commands.setContent(mdToHtml(rawRef.current))
          setPhase('done')
        }
      )
    } catch (e: any) {
      setError(e?.message || '生成失败，请重试')
      setPhase('idle')
    }
  }

  const handleFollowUp = async () => {
    if (!followUp.trim() || phase === 'streaming') return
    const prev = rawRef.current
    setPhase('streaming')
    setStreamText('')
    rawRef.current = ''

    try {
      await streamChat(
        [
          { role: 'assistant', content: prev },
          { role: 'user', content: followUp },
        ],
        (chunk) => {
          rawRef.current += chunk
          setStreamText(rawRef.current)
        },
        () => {
          editor?.commands.setContent(mdToHtml(rawRef.current))
          setPhase('done')
        }
      )
    } catch (e: any) {
      setError(e?.message || '修改失败，请重试')
      setPhase('idle')
    }
    setFollowUp('')
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">教案自动化生成</h1>
          <p className="mt-1 text-slate-500 text-sm">配置课程信息，AI 将实时生成专业教学方案。</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-medium">
            <History size={15} /> 历史版本
          </button>
          <button
            onClick={handleExport}
            disabled={phase !== 'done' || exporting}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-white rounded-xl text-sm font-medium transition-all',
              phase !== 'done' || exporting ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
            )}
          >
            {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {exporting ? '导出中...' : '导出 PDF'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* 左侧配置 */}
        <div className="w-72 flex flex-col gap-4 overflow-y-auto shrink-0 pb-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <p className="text-xs font-bold text-indigo-600 flex items-center gap-1.5"><Settings2 size={13} /> 课程配置</p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">课程主题 / 曲目</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/30" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">教学科目</label>
              <select value={instrument} onChange={(e) => setInstrument(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm outline-none appearance-none focus:ring-2 focus:ring-indigo-500/30">
                <option>钢琴 (Piano)</option>
                <option>声乐 (Vocal)</option>
                <option>乐理 (Theory)</option>
                <option>古筝 (Guzheng)</option>
                <option>小提琴 (Violin)</option>
                <option>吉他 (Guitar)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">学生级别</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm outline-none appearance-none focus:ring-2 focus:ring-indigo-500/30">
                <option>初级 (1-3 级)</option>
                <option>中级 (4-6 级)</option>
                <option>高级 (7-10 级)</option>
                <option>专业演奏级</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">课时时长</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm outline-none appearance-none focus:ring-2 focus:ring-indigo-500/30">
                <option>30 分钟</option>
                <option>45 分钟</option>
                <option>60 分钟</option>
                <option>90 分钟</option>
              </select>
            </div>

            <button onClick={handleGenerate} disabled={phase === 'streaming'}
              className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all',
                phase === 'streaming' ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100')}>
              <Sparkles size={16} className={phase === 'streaming' ? 'animate-spin' : ''} />
              {phase === 'streaming' ? 'AI 生成中...' : '一键生成教案'}
            </button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                <AlertCircle size={13} /> {error}
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={15} className="text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300">知识库匹配</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              已自动关联：<span className="text-slate-200">《古典时期触键标准》</span> 与 <span className="text-slate-200">《莫扎特速度标记解析》</span>
            </p>
          </div>
        </div>

        {/* 编辑器区 */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* 流式输出时显示原始 markdown 文字 */}
          {phase === 'streaming' ? (
            <div ref={streamBoxRef} className="flex-1 overflow-y-auto p-8 font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {streamText}
              <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle" />
            </div>
          ) : (
            <>
              <MenuBar editor={editor} />
              <div ref={editorContainerRef} className="flex-1 overflow-y-auto">
                <EditorContent editor={editor} />
              </div>
            </>
          )}

          {/* 底部对话条 */}
          <div className="border-t border-slate-100 p-3 flex items-center gap-3 bg-slate-50/50">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <input type="text" value={followUp} onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
              placeholder={phase === 'done' ? '告诉 AI 如何修改（Enter 发送）...' : '生成教案后可在此继续修改...'}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              disabled={phase === 'streaming'} />
            <button onClick={handleFollowUp} disabled={!followUp.trim() || phase === 'streaming'}
              className={cn('p-2 rounded-xl transition-all',
                !followUp.trim() || phase === 'streaming' ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700')}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
