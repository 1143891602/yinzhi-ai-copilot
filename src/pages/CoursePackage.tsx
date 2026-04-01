import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, ChevronDown, Download, FileText, Plus, RotateCcw, Sparkles, Wand2 } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { streamChat, isApiConfigured } from '@/lib/ai'

const courseTypes = ['常规系统课', '考级冲刺课', '启蒙兴趣课', '舞台表演课']
const ageGroups = ['4-6 岁', '7-9 岁', '10-12 岁', '13-16 岁', '成人']
const frequencies = ['每周 1 次', '每周 2 次', '每周 3 次', '集训营模式']

const presets = [
  {
    title: '白色轻盈版钢琴课包',
    description: '适合强调家长感知与成长路径展示的常规钢琴课程体系。',
    tags: ['钢琴', '阶段成长', '家长好理解'],
  },
  {
    title: '舞台表现型声乐课包',
    description: '突出舞台表达、作品输出与阶段展示节点，适合寒暑假招生转化。',
    tags: ['声乐', '舞台表现', '短期成果'],
  },
  {
    title: '高阶考级推进课包',
    description: '围绕考级目标拆解课时、作业与复盘节点，适合高客单价课程设计。',
    tags: ['考级', '高客单', '结果导向'],
  },
]

export default function CoursePackage() {
  const navigate = useNavigate()
  const resultRef = useRef<HTMLDivElement>(null)

  const [courseType, setCourseType] = useState(courseTypes[0])
  const [ageGroup, setAgeGroup] = useState(ageGroups[1])
  const [frequency, setFrequency] = useState(frequencies[0])
  const [duration, setDuration] = useState('12 周')
  const [goal, setGoal] = useState('建立稳定练习习惯，完成 2 首阶段展示作品，并形成可感知的成长反馈。')
  const [highlights, setHighlights] = useState('阶段测评、家长反馈模板、展示课、成长档案')
  const [lessonTitle, setLessonTitle] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  const canGenerate = useMemo(() => goal.trim().length > 0 && duration.trim().length > 0, [goal, duration])

  async function handleGenerate() {
    if (!canGenerate || loading) return

    if (!isApiConfigured()) {
      alert('请先在系统设置中配置 API 信息。')
      navigate('/settings')
      return
    }

    setLoading(true)
    setResult('')

    const prompt = `你是一位资深音乐教育产品策划顾问。请基于以下信息，生成一份结构清晰、适合艺培机构内部讨论和对家长展示的课程包方案，使用简体中文，输出使用 Markdown：

课程类型：${courseType}
适龄群体：${ageGroup}
上课频率：${frequency}
课程周期：${duration}
课程目标：${goal}
亮点设计：${highlights || '无'}
课包名称偏好：${lessonTitle || '请自行拟定'}

请至少包含以下部分：
1. 课程包名称与一句话定位
2. 适合人群与开课目标
3. 阶段式课程结构（按周或模块）
4. 每阶段教学重点与成果呈现
5. 家长可感知价值与沟通要点
6. 招生/转化卖点总结
7. 可执行的课后配套（作业、反馈、展示、测评）`

    try {
      await streamChat([{ role: 'user', content: prompt }], (chunk) => {
        setResult((prev) => prev + chunk)
      })
    } catch (error) {
      console.error(error)
      alert('生成失败，请检查 API 配置或稍后重试。')
    } finally {
      setLoading(false)
    }
  }

  async function handleExport() {
    if (!resultRef.current || !result || exporting) return

    setExporting(true)
    try {
      const canvas = await html2canvas(resultRef.current, {
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

      pdf.save(`音智AI课程包_${lessonTitle || courseType}.pdf`)
    } catch (error) {
      console.error(error)
      alert('导出 PDF 失败，请稍后再试。')
    } finally {
      setExporting(false)
    }
  }

  function renderMarkdown(lines: string[]) {
    return lines.map((line, index) => {
      const text = line.trim()
      if (!text) return <div key={index} className="h-3" />

      if (text.startsWith('# ')) {
        return (
          <h1 key={index} className="mb-5 text-3xl font-black tracking-tight text-slate-900">
            {text.replace(/^#\s+/, '')}
          </h1>
        )
      }

      if (text.startsWith('## ')) {
        return (
          <h2 key={index} className="mt-8 mb-4 text-xl font-black text-slate-900">
            {text.replace(/^##\s+/, '')}
          </h2>
        )
      }

      if (text.startsWith('### ')) {
        return (
          <h3 key={index} className="mt-7 mb-3 text-lg font-bold text-slate-800">
            {text.replace(/^###\s+/, '')}
          </h3>
        )
      }

      if (/^[-*]\s+/.test(text)) {
        return (
          <div key={index} className={`group flex items-start gap-3 rounded-2xl px-2 py-1 transition-colors ${lessonTitle ? 'hover:bg-premium-purple/4 -mx-2' : ''}`}>
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-premium-purple/70" />
            <p className="flex-1 text-[15px] leading-8 text-slate-700">{text.replace(/^[-*]\s+/, '')}</p>
          </div>
        )
      }

      if (/^\d+\.\s+/.test(text)) {
        const match = text.match(/^(\d+)\.\s+(.*)$/)
        return (
          <div key={index} className={`group flex items-start gap-3 rounded-2xl px-2 py-1 transition-colors ${lessonTitle ? 'hover:bg-sky-50/70 -mx-2' : ''}`}>
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white shadow-[0_10px_20px_rgba(15,23,42,0.14)]">
              {match?.[1]}
            </span>
            <p className="flex-1 text-[15px] leading-8 text-slate-700">{match?.[2]}</p>
          </div>
        )
      }

      return (
        <p key={index} className="text-[15px] leading-8 text-slate-700">
          {text}
        </p>
      )
    })
  }

  return (
    <div className="relative mx-auto max-w-6xl space-y-8 px-4 pb-20 pt-4 lg:px-6">
      <div className="ambient-glow right-[10%] top-[12%] h-[220px] w-[220px] bg-sky-300/16 animate-float-slow" />
      <div className="ambient-glow left-[2%] top-[18%] h-[200px] w-[200px] bg-premium-purple/12 animate-drift" />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-glass relative overflow-hidden px-8 py-9 lg:px-10 lg:py-11"
      >
        <div className="absolute inset-y-0 right-0 w-[34%] bg-gradient-to-l from-sky-100/65 via-transparent to-transparent" />
        <div className="absolute right-[-18px] top-4 h-40 w-40 rounded-full bg-sky-300/18 blur-3xl animate-breathe-slow" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-4">
              <div className="secondary-glass flex h-14 w-14 items-center justify-center rounded-[24px] bg-white/80">
                <BookOpen className="text-sky-600" size={22} />
              </div>
              <div>
                <p className="mono-label">Course package / product design</p>
                <h1 className="hero-text mt-3 text-[clamp(2.4rem,5.6vw,4.4rem)]">
                  课程设计，<br />
                  <strong>也可以像产品提案一样通透。</strong>
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-[16px] leading-8 text-slate-500">
              用一套更轻的生成界面，把课程目标、阶段结构、家长可感知价值和招生卖点整合成可讨论、可展示、可导出的课程包方案。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {presets.map((preset) => (
              <button
                key={preset.title}
                onClick={() => {
                  setLessonTitle(preset.title)
                  setGoal(preset.description)
                  setHighlights(preset.tags.join(' / '))
                }}
                className="secondary-glass rounded-[24px] bg-white/72 px-4 py-4 text-left transition-all hover:bg-white"
              >
                <div className="flex items-center justify-between gap-2">
                  <Sparkles size={15} className="text-premium-purple" />
                  <span className="mono-label text-slate-400">Preset</span>
                </div>
                <p className="mt-4 text-sm font-black leading-6 text-slate-900">{preset.title}</p>
                <p className="mt-2 text-xs leading-6 text-slate-500">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="premium-glass lg:col-span-5 p-6 lg:p-7"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="section-title text-[1.55rem]">
                课包<span className="font-black">参数.</span>
              </h2>
              <p className="mono-label mt-2 text-slate-400">Structure your offer clearly</p>
            </div>
            <div className="secondary-glass flex h-11 w-11 items-center justify-center rounded-[18px] bg-white/76">
              <Wand2 size={18} className="text-premium-purple" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="mono-label">课包名称</label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(event) => setLessonTitle(event.target.value)}
                placeholder="例如：12周钢琴成长启航课"
                className="w-full rounded-[22px] border border-slate-200 bg-white/78 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="mono-label">课程类型</label>
                <div className="relative">
                  <select
                    value={courseType}
                    onChange={(event) => setCourseType(event.target.value)}
                    className="w-full appearance-none rounded-[22px] border border-slate-200 bg-white/78 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
                  >
                    {courseTypes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="mono-label">适龄群体</label>
                <div className="relative">
                  <select
                    value={ageGroup}
                    onChange={(event) => setAgeGroup(event.target.value)}
                    className="w-full appearance-none rounded-[22px] border border-slate-200 bg-white/78 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
                  >
                    {ageGroups.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="mono-label">上课频率</label>
                <div className="relative">
                  <select
                    value={frequency}
                    onChange={(event) => setFrequency(event.target.value)}
                    className="w-full appearance-none rounded-[22px] border border-slate-200 bg-white/78 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
                  >
                    {frequencies.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="mono-label">课程周期</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="例如：12 周 / 24 课时"
                  className="w-full rounded-[22px] border border-slate-200 bg-white/78 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="mono-label">课程目标</label>
              <textarea
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                rows={4}
                placeholder="写下这套课包最终想解决什么问题、达成什么成果..."
                className="w-full rounded-[24px] border border-slate-200 bg-white/78 px-5 py-4 text-sm leading-7 text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
              />
            </div>

            <div className="space-y-2">
              <label className="mono-label">亮点设计</label>
              <textarea
                value={highlights}
                onChange={(event) => setHighlights(event.target.value)}
                rows={3}
                placeholder="例如：阶段测评、家长周报、结课舞台展示..."
                className="w-full rounded-[24px] border border-slate-200 bg-white/78 px-5 py-4 text-sm leading-7 text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                setLessonTitle('')
                setCourseType(courseTypes[0])
                setAgeGroup(ageGroups[1])
                setFrequency(frequencies[0])
                setDuration('12 周')
                setGoal('建立稳定练习习惯，完成 2 首阶段展示作品，并形成可感知的成长反馈。')
                setHighlights('阶段测评、家长反馈模板、展示课、成长档案')
                setResult('')
              }}
              className="ghost-btn justify-center"
            >
              <RotateCcw size={16} />
              重置参数
            </button>
            <button onClick={handleGenerate} disabled={!canGenerate || loading} className="apple-btn justify-center">
              <Sparkles size={16} />
              {loading ? '正在生成课包...' : '生成课程包方案'}
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="premium-glass lg:col-span-7 overflow-hidden"
        >
          <div className="flex flex-col gap-5 border-b border-slate-200/80 px-7 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="section-title text-[1.55rem]">
                方案<span className="font-black">输出.</span>
              </h2>
              <p className="mono-label mt-2 text-slate-400">智能生成的结构化课程建议</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => navigate('/lesson-plan')} className="ghost-btn justify-center">
                <Plus size={16} />
                去做教案
              </button>
              <button onClick={handleExport} disabled={!result || exporting} className="apple-btn justify-center">
                <Download size={16} />
                {exporting ? '导出中...' : '导出 PDF'}
              </button>
            </div>
          </div>

          {result ? (
            <div className="bg-white/42 p-5 lg:p-7">
              <div ref={resultRef} className="secondary-glass min-h-[760px] rounded-[32px] bg-white/86 p-8 lg:p-10 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
                <div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <p className="mono-label text-slate-400">Course package preview</p>
                    <p className="mt-2 text-sm text-slate-500">已按适合导出与内部评审的阅读密度排版</p>
                  </div>
                  <div className="secondary-glass rounded-full bg-white/76 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                    generated by ai
                  </div>
                </div>

                <div className="space-y-1 relative">
                  {renderMarkdown(result.split('\n'))}
                  {loading && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block ml-1 h-5 w-1 bg-sky-500 align-middle"
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[760px] flex-col items-center justify-center px-8 text-center">
              <div className="secondary-glass flex h-24 w-24 items-center justify-center rounded-[30px] bg-white/78">
                <Plus size={28} className="text-sky-500" />
              </div>
              <h3 className="mt-8 text-2xl font-black tracking-tight text-slate-900">配置课程参数，生成大纲</h3>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">
                输入目标、频率和课包亮点后，右侧会生成一份既适合机构内部讨论，也方便对家长展示的完整课程包方案。
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {['课程定位', '阶段结构', '沟通价值', '招生卖点'].map((tag) => (
                  <span key={tag} className="rounded-full bg-white/78 px-4 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}
