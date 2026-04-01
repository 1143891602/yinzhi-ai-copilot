import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Trash2, RotateCcw, FileText, Clock, Music, ChevronRight, Download, Check, Sparkles, X, Plus } from 'lucide-react'
import { getLessons, deleteLesson, type SavedLesson } from '@/lib/lessonStorage'
import { cn } from '@/lib/utils'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const SUBJECTS = ['全部', '钢琴', '声乐', '古筝', '小提琴', '吉他', '乐理']

const subjectColors: Record<string, string> = {
  '钢琴': 'text-blue-600 bg-blue-50',
  '声乐': 'text-purple-600 bg-purple-50',
  '古筝': 'text-emerald-600 bg-emerald-50',
  '小提琴': 'text-orange-600 bg-orange-50',
  '吉他': 'text-pink-600 bg-pink-50',
  '乐理': 'text-slate-600 bg-slate-100',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} 天前`
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export default function MyLessons() {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState<SavedLesson[]>([])
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('全部')
  const [preview, setPreview] = useState<SavedLesson | null>(null)
  const [exporting, setExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLessons(getLessons())
  }, [])

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (confirm('确定要删除这篇教案吗？')) {
      deleteLesson(id)
      setLessons(getLessons())
      if (preview?.id === id) setPreview(null)
    }
  }

  function handleReuse(lesson: SavedLesson) {
    navigate(`/lesson-plan?topic=${encodeURIComponent(lesson.title)}&instrument=${encodeURIComponent(lesson.subject)}&level=${encodeURIComponent(lesson.level)}`)
  }

  async function handleExport() {
    if (!preview || !previewRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`音智AI教案_${preview.title}.pdf`)
    } catch (err) {
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  const filtered = lessons.filter(l => {
    const matchQuery = l.title.includes(query)
    const matchSubject = subject === '全部' || l.subject === subject
    return matchQuery && matchSubject
  })

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] flex gap-6">
      {/* 左：列表 */}
      <div className="w-[450px] flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">教案库 ({lessons.length})</h2>
            <button onClick={() => navigate('/lesson-plan')} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="搜索教案标题..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SUBJECTS.map(s => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                  subject === s ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map(l => (
            <button
              key={l.id}
              onClick={() => setPreview(l)}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all group",
                preview?.id === l.id ? "bg-indigo-50/80 ring-1 ring-indigo-100 shadow-sm" : "hover:bg-slate-50"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider", subjectColors[l.subject] || 'bg-slate-100 text-slate-500')}>
                  {l.subject}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Clock size={10} /> {formatDate(l.createdAt)}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-3 line-clamp-1">{l.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{l.level}</span>
                  <span>·</span>
                  <span>{l.duration}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleDelete(l.id, e)} className="p-1.5 text-slate-300 hover:text-rose-500"><Trash2 size={14} /></button>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-20 text-center opacity-40">
              <FileText size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-sm font-medium text-slate-400">教案库空空如也</p>
            </div>
          )}
        </div>
      </div>

      {/* 右：预览区 */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {preview ? (
          <>
            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-base">{preview.title}</h2>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    创建于 {new Date(preview.createdAt).toLocaleString()} · {preview.subject} · {preview.level}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleReuse(preview)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
                >
                  <RotateCcw size={14} /> 重新生成
                </button>
                <button 
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {exporting ? <Clock size={14} className="animate-spin" /> : <Download size={14} />}
                  导出 PDF
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-slate-50/50">
              <div 
                ref={previewRef}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 min-h-full prose prose-slate max-w-none"
              >
                <div 
                  className="markdown-content text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: preview.content
                      .replace(/# (.*)/g, '<h1 class="text-2xl font-bold mb-6 text-slate-900">$1</h1>')
                      .replace(/## (.*)/g, '<h2 class="text-lg font-bold mt-8 mb-4 text-slate-800 border-l-4 border-indigo-500 pl-3">$1</h2>')
                      .replace(/\n/g, '<br/>') 
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
              <Search size={32} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">选择一份教案预览</h3>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              点击左侧列表中的教案，可以快速预览全文内容、重新编辑或导出为标准 PDF 格式。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
