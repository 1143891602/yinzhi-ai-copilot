import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Trash2, RotateCcw, FileText, Clock, Music } from 'lucide-react'
import { getLessons, deleteLesson, type SavedLesson } from '@/lib/lessonStorage'
import { cn } from '@/lib/utils'

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

  useEffect(() => {
    setLessons(getLessons())
  }, [])

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    deleteLesson(id)
    setLessons(getLessons())
    if (preview?.id === id) setPreview(null)
  }

  function handleReuse(lesson: SavedLesson) {
    // 跳转教案生成页并带上复用参数
    navigate(`/lesson-plan?reuse=${encodeURIComponent(JSON.stringify({
      subject: lesson.subject,
      title: lesson.title,
      level: lesson.level,
    }))}`)
  }

  const filtered = lessons.filter(l => {
    const matchQuery = l.title.includes(query) || l.subject.includes(query)
    const matchSubject = subject === '全部' || l.subject === subject
    return matchQuery && matchSubject
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold text-indigo-500 mb-1 tracking-widest uppercase">My Lessons</p>
        <h1 className="text-2xl font-bold text-slate-900">我的教案库</h1>
        <p className="mt-1 text-slate-500 text-sm">所有已保存的教案，支持一键复用重新生成。</p>
      </div>

      <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 220px)' }}>
        {/* 左：列表 */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* 搜索 + 筛选 */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="搜索教案名称..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                    subject === s ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 统计 */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileText size={12} />
            共 <span className="font-bold text-slate-600">{filtered.length}</span> 份教案
          </div>

          {/* 列表 */}
          {filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-sm font-semibold text-slate-400">
                {lessons.length === 0 ? '还没有保存过教案' : '没有找到匹配的教案'}
              </p>
              {lessons.length === 0 && (
                <button
                  onClick={() => navigate('/lesson-plan')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all"
                >
                  去生成第一份教案
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => setPreview(lesson)}
                  className={cn(
                    'p-4 bg-white rounded-2xl border cursor-pointer transition-all',
                    preview?.id === lesson.id
                      ? 'border-indigo-300 shadow-md ring-2 ring-indigo-500/10'
                      : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-lg', subjectColors[lesson.subject] || 'text-slate-600 bg-slate-100')}>
                          <Music size={9} className="inline mr-1" />{lesson.subject}
                        </span>
                        <span className="text-xs text-slate-400">{lesson.level}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 truncate">{lesson.title}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Clock size={10} />{formatDate(lesson.createdAt)}</span>
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); handleReuse(lesson) }}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all"
                      >
                        <RotateCcw size={11} /> 复用
                      </button>
                      <button
                        onClick={e => handleDelete(lesson.id, e)}
                        className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右：预览 */}
        {preview ? (
          <div className="w-80 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-50">
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded-lg', subjectColors[preview.subject] || 'text-slate-600 bg-slate-100')}>
                {preview.subject}
              </span>
              <h3 className="text-sm font-bold text-slate-800 mt-2">{preview.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{preview.level} · {preview.duration} · {formatDate(preview.createdAt)}</p>
            </div>
            <div className="flex-1 p-5 overflow-y-auto text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
              {preview.content.slice(0, 800)}{preview.content.length > 800 ? '...' : ''}
            </div>
            <div className="px-5 py-4 border-t border-slate-50 flex gap-2">
              <button
                onClick={() => handleReuse(preview)}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all"
              >
                一键复用
              </button>
              <button
                onClick={e => handleDelete(preview.id, e)}
                className="px-3 py-2.5 text-xs font-bold text-slate-400 bg-slate-100 rounded-xl hover:bg-red-50 hover:text-red-400 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-80 shrink-0 bg-white rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-center p-8">
            <div>
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm font-semibold text-slate-400">点击左侧教案</p>
              <p className="text-xs text-slate-300 mt-1">预览内容</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
