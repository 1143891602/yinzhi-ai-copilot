import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Clock,
  Download,
  FileText,
  Layers,
  Music,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { getLessons, deleteLesson, type SavedLesson } from '@/lib/lessonStorage'
import { cn } from '@/lib/utils'

const SUBJECTS = ['全部', '钢琴', '声乐', '古筝', '小提琴', '吉他', '乐理']

const subjectColors: Record<string, string> = {
  钢琴: 'bg-sky-100 text-sky-700 border-sky-200',
  声乐: 'bg-premium-purple/10 text-premium-purple border-premium-purple/15',
  古筝: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  小提琴: 'bg-amber-100 text-amber-700 border-amber-200',
  吉他: 'bg-rose-100 text-rose-700 border-rose-200',
  乐理: 'bg-slate-100 text-slate-700 border-slate-200',
}

function formatDate(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)

  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins} 分钟前`

  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} 天前`

  return `${date.getMonth() + 1}月${date.getDate()}日`
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
    const data = getLessons()
    setLessons(data)
    setPreview(data[0] || null)
  }, [])

  const filteredLessons = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return lessons.filter((lesson) => {
      const matchQuery = !keyword || lesson.title.toLowerCase().includes(keyword)
      const matchSubject = subject === '全部' || lesson.subject === subject
      return matchQuery && matchSubject
    })
  }, [lessons, query, subject])

  useEffect(() => {
    if (!preview) {
      if (filteredLessons[0]) setPreview(filteredLessons[0])
      return
    }

    const exists = filteredLessons.some((lesson) => lesson.id === preview.id)
    if (!exists) {
      setPreview(filteredLessons[0] || null)
    }
  }, [filteredLessons, preview])

  function refreshLessons() {
    const data = getLessons()
    setLessons(data)
    return data
  }

  function handleDelete(id: string, event: React.MouseEvent) {
    event.stopPropagation()

    if (!confirm('确定要删除这篇教案吗？')) return

    deleteLesson(id)
    const next = refreshLessons()
    if (preview?.id === id) {
      setPreview(next[0] || null)
    }
  }

  function handleReuse(lesson: SavedLesson) {
    navigate(
      `/lesson-plan?topic=${encodeURIComponent(lesson.title)}&subject=${encodeURIComponent(lesson.subject)}&level=${encodeURIComponent(lesson.level)}`
    )
  }

  async function handleExport() {
    if (!preview || !previewRef.current || exporting) return

    setExporting(true)
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight = (canvas.height * pageWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`音智AI教案_${preview.title}.pdf`)
    } catch (error) {
      console.error(error)
    } finally {
      setExporting(false)
    }
  }

  const totalCount = lessons.length
  const filteredCount = filteredLessons.length
  const subjectsCount = new Set(lessons.map((lesson) => lesson.subject)).size
  const latestLesson = lessons[0]

  return (
    <div className="relative mx-auto max-w-7xl space-y-8 px-4 pb-20 pt-4 lg:px-6">
      <div className="ambient-glow left-[8%] top-[12%] h-[220px] w-[220px] bg-premium-purple/12 animate-drift" />
      <div className="ambient-glow right-[4%] top-[28%] h-[240px] w-[240px] bg-sky-300/16 animate-float-slow" />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-glass relative overflow-hidden px-8 py-9 lg:px-10 lg:py-11"
      >
        <div className="absolute inset-y-0 right-0 w-[36%] bg-gradient-to-l from-premium-purple/6 via-transparent to-transparent" />
        <div className="absolute right-[-24px] top-2 h-44 w-44 rounded-full bg-premium-purple/12 blur-3xl animate-breathe-slow" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-4">
              <div className="secondary-glass flex h-14 w-14 items-center justify-center rounded-[24px] bg-white/78">
                <FileText className="text-premium-purple" size={22} />
              </div>
              <div>
                <p className="mono-label">Lesson library / local archive</p>
                <h1 className="hero-text mt-3 text-[clamp(2.4rem,5.6vw,4.4rem)]">
                  教案积累，<br />
                  <strong>也值得拥有轻盈的阅读感。</strong>
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-[16px] leading-8 text-slate-500">
              这里汇总了所有已保存教案。你可以在白色玻璃空间里快速筛选、复用、导出，像翻看一套有秩序的教学作品集。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-4">
            {[
              { label: '教案总数', value: totalCount },
              { label: '当前匹配', value: filteredCount },
              { label: '学科数量', value: subjectsCount },
              { label: '最近更新', value: latestLesson ? formatDate(latestLesson.createdAt) : '暂无' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -5, scale: 1.02 }}
                className="secondary-glass min-w-[120px] rounded-[24px] bg-white/70 px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(110,44,242,0.08)]"
              >
                <p className="mono-label text-[10px] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-xl font-black tabular-nums tracking-tight text-slate-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="premium-glass lg:col-span-4 overflow-hidden p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="section-title text-[1.55rem]">
                教案<span className="font-black">库.</span>
              </h2>
              <p className="mono-label mt-2 text-slate-400">Organized by subject and recency</p>
            </div>
            <button onClick={() => navigate('/lesson-plan')} className="apple-btn px-4 py-3 text-sm">
              <Plus size={16} />
              新建教案
            </button>
          </div>

          <div className="secondary-glass mt-6 flex items-center gap-3 rounded-[24px] bg-white/72 px-4 py-4">
            <Search size={17} className="text-slate-400" />
            <input
              type="text"
              placeholder="搜索教案标题..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-350"
            />
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SUBJECTS.map((item) => (
              <button
                key={item}
                onClick={() => setSubject(item)}
                className={cn(
                  'rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all whitespace-nowrap',
                  subject === item
                    ? 'bg-slate-900 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]'
                    : 'bg-white/70 text-slate-500 hover:bg-white hover:text-slate-800'
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 flex max-h-[720px] flex-col gap-3 overflow-y-auto pr-1 no-scrollbar">
            {filteredLessons.map((lesson) => {
              const isActive = preview?.id === lesson.id

              return (
                <button
                  key={lesson.id}
                  onClick={() => setPreview(lesson)}
                  className={cn(
                    'secondary-glass relative overflow-hidden rounded-[26px] p-5 text-left transition-all duration-300',
                    isActive
                      ? 'bg-white/85 ring-1 ring-premium-purple/15 shadow-[0_22px_40px_rgba(110,44,242,0.10)]'
                      : 'bg-white/58 hover:bg-white/76'
                  )}
                >
                  {isActive && <div className="absolute inset-y-6 left-0 w-1 rounded-full bg-premium-purple" />}

                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        'rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase',
                        subjectColors[lesson.subject] || 'bg-slate-100 text-slate-700 border-slate-200'
                      )}
                    >
                      {lesson.subject}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={11} />
                      {formatDate(lesson.createdAt)}
                    </span>
                  </div>

                  <h3 className="mt-4 line-clamp-2 text-[15px] font-black leading-7 text-slate-900">{lesson.title}</h3>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Music size={12} />
                      <span>{lesson.level}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{lesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(event) => handleDelete(lesson.id, event)}
                        className="rounded-full p-2 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                        aria-label="删除教案"
                      >
                        <Trash2 size={14} />
                      </button>
                      <ChevronRight size={16} className={isActive ? 'text-premium-purple' : 'text-slate-300'} />
                    </div>
                  </div>
                </button>
              )
            })}

            {filteredLessons.length === 0 && (
              <div className="secondary-glass rounded-[28px] px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/80">
                  <Search size={24} className="text-slate-300" />
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-500">当前筛选条件下没有教案</p>
                <p className="mt-2 text-xs leading-6 text-slate-400">尝试切换学科或修改搜索关键词。</p>
              </div>
            )}
          </div>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8"
        >
          {preview ? (
            <div className="premium-glass overflow-hidden">
              <div className="flex flex-col gap-5 border-b border-slate-200/80 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="secondary-glass flex h-14 w-14 items-center justify-center rounded-[22px] bg-white/78">
                    <FileText size={22} className="text-premium-purple" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase',
                          subjectColors[preview.subject] || 'bg-slate-100 text-slate-700 border-slate-200'
                        )}
                      >
                        {preview.subject}
                      </span>
                      <span className="rounded-full bg-white/75 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                        {preview.level}
                      </span>
                    </div>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">{preview.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      创建于 {new Date(preview.createdAt).toLocaleString()}，内容来自你的本地教案库，可继续生成、二次编辑或导出为 PDF。
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => handleReuse(preview)} className="ghost-btn justify-center">
                    <RotateCcw size={16} />
                    重新生成
                  </button>
                  <button onClick={handleExport} disabled={exporting} className="apple-btn justify-center">
                    <Download size={16} />
                    {exporting ? '导出中...' : '导出 PDF'}
                  </button>
                </div>
              </div>

              <div className="bg-white/44 p-5 lg:p-8">
                <div
                  ref={previewRef}
                  className="secondary-glass min-h-[720px] rounded-[32px] bg-white/86 p-8 lg:p-12 shadow-[0_24px_60px_rgba(15,23,42,0.06)]"
                >
                  <div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <p className="mono-label text-slate-400">Preview rendering</p>
                      <p className="mt-2 text-sm text-slate-500">适配打印导出的阅读排版</p>
                    </div>
                    <div className="secondary-glass rounded-full bg-white/72 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                      live html
                    </div>
                  </div>

                  <div
                    className="text-[15px] leading-8 text-slate-700 [&_h1]:mb-6 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-800 [&_p]:my-3 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-premium-purple/20 [&_blockquote]:bg-premium-purple/5 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:rounded-r-2xl"
                    dangerouslySetInnerHTML={{ __html: preview.content }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="premium-glass flex min-h-[720px] flex-col items-center justify-center px-8 text-center">
              <div className="secondary-glass flex h-24 w-24 items-center justify-center rounded-[30px] bg-white/78">
                <Layers size={34} className="text-slate-300" />
              </div>
              <h3 className="mt-8 text-2xl font-black tracking-tight text-slate-900">从左侧挑选一份教案</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                你可以浏览最近生成的内容、切换学科筛选，或直接从这里跳回生成器继续迭代新的版本。
              </p>
              <button onClick={() => navigate('/lesson-plan')} className="ghost-btn mt-8">
                <Sparkles size={16} />
                前往教案生成器
              </button>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}
