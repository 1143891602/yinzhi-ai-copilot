import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, BookOpen, Download, RotateCcw, ChevronDown, Plus, FileText } from 'lucide-react'
import { streamChat } from '@/lib/ai'
import { cn } from '@/lib/utils'

type FormData = {
  ageGroup: string
  studentLevel: string
  totalLessons: string
  lessonDuration: string
  teachingStyle: string
  courseType: string
  extra: string
}

const options = {
  ageGroup: ['2-3岁', '3-4岁', '5-6岁', '7-8岁', '9-12岁', '成人'],
  studentLevel: ['零基础', '半年基础', '一年以上', '考级备考'],
  lessonDuration: ['30分钟', '45分钟', '60分钟', '90分钟'],
  teachingStyle: ['奥尔夫体系', '柯达伊体系', '达尔克罗兹', '铃木教学法', '综合体系'],
  courseType: ['钢琴', '声乐', '音乐启蒙', '乐理', '古筝', '小提琴', '吉他'],
}

function Select({ label, value, onChange, items }: {
  label: string; value: string; onChange: (v: string) => void; items: string[]
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 pr-8"
        >
          <option value="">请选择</option>
          {items.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
}

// 从大纲文本里解析出课次标题（匹配「第N课」行）
function parseLessons(text: string): { line: string; title: string }[] {
  const results: { line: string; title: string }[] = []
  const lines = text.split('\n')
  for (const line of lines) {
    const match = line.match(/第\d+课[^\|｜]*[\|｜]\s*([^\|｜]+)/)
    if (match) results.push({ line, title: match[1].trim() })
  }
  return results
}

export default function CoursePackage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>({
    ageGroup: '', studentLevel: '', totalLessons: '48',
    lessonDuration: '45分钟', teachingStyle: '综合体系', courseType: '钢琴', extra: ''
  })
  const [outline, setOutline] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const abortRef = useRef(false)

  const set = (k: keyof FormData) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const canGenerate = form.ageGroup && form.studentLevel && form.totalLessons && form.courseType

  async function handleGenerate() {
    if (!canGenerate) return
    setOutline('')
    setDone(false)
    setLoading(true)
    abortRef.current = false

    const prompt = `你是一位专业的音乐教研总监，请为以下课程生成一套完整的体系化大课包大纲目录。

课程参数：
- 课程类型：${form.courseType}
- 目标年龄段：${form.ageGroup}
- 学员基础：${form.studentLevel}
- 课程总课时：${form.totalLessons} 课时
- 单课时长：${form.lessonDuration}
- 教学体系风格：${form.teachingStyle}
${form.extra ? `- 补充说明：${form.extra}` : ''}

请生成完整的课时目录表，格式如下：
## ${form.courseType}${form.ageGroup}${form.studentLevel}大课包（${form.totalLessons}课时）

### 第一阶段：（阶段名称，X课时）
| 课次 | 课题名称 | 核心知识点 | 教学目标 |
|------|---------|-----------|---------|
| 第1课 | ... | ... | ... |
...

按阶段分组，每个阶段包含若干课次，覆盖全部${form.totalLessons}课时。内容要专业、系统、循序渐进，符合${form.ageGroup}年龄段学员的认知特点。`

    await streamChat(
      [{ role: 'user', content: prompt }],
      (chunk) => {
        if (!abortRef.current) setOutline(prev => prev + chunk)
      },
      () => { setLoading(false); setDone(true) }
    )
  }

  function handleExport() {
    const blob = new Blob([outline], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.courseType}${form.ageGroup}大课包-${form.totalLessons}课时.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold text-indigo-500 mb-1 tracking-widest uppercase">Course Package</p>
        <h1 className="text-2xl font-bold text-slate-900">智能大课包生成器</h1>
        <p className="mt-1 text-slate-500 text-sm">输入课程参数，AI 自动生成完整体系化课程大纲，一键建立机构标准化课程体系。</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* 左：参数面板 */}
        <div className="w-72 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BookOpen size={15} className="text-indigo-500" /> 课程参数配置
            </h2>

            <Select label="课程类型 *" value={form.courseType} onChange={set('courseType')} items={options.courseType} />
            <Select label="目标年龄段 *" value={form.ageGroup} onChange={set('ageGroup')} items={options.ageGroup} />
            <Select label="学员基础 *" value={form.studentLevel} onChange={set('studentLevel')} items={options.studentLevel} />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">课程总课时 *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={form.totalLessons}
                  onChange={e => set('totalLessons')(e.target.value)}
                  min={8} max={200} step={8}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
                <span className="text-xs text-slate-400 shrink-0">课时</span>
              </div>
            </div>

            <Select label="单课时长" value={form.lessonDuration} onChange={set('lessonDuration')} items={options.lessonDuration} />
            <Select label="教学体系风格" value={form.teachingStyle} onChange={set('teachingStyle')} items={options.teachingStyle} />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">补充说明（选填）</label>
              <textarea
                value={form.extra}
                onChange={e => set('extra')(e.target.value)}
                placeholder="如：每8课时安排一次汇报课..."
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
                canGenerate && !loading
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              <Sparkles size={15} />
              {loading ? 'AI 生成中...' : '生成课程大纲'}
            </button>
          </div>

          {/* 快速预设 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">快速预设</h3>
            <div className="space-y-2">
              {[
                { label: '🎹 钢琴启蒙 48课时', ageGroup: '5-6岁', studentLevel: '零基础', totalLessons: '48', courseType: '钢琴', teachingStyle: '综合体系', lessonDuration: '45分钟', extra: '' },
                { label: '🎤 少儿声乐 96课时', ageGroup: '7-8岁', studentLevel: '零基础', totalLessons: '96', courseType: '声乐', teachingStyle: '柯达伊体系', lessonDuration: '45分钟', extra: '' },
                { label: '🎵 音乐启蒙 144课时', ageGroup: '3-4岁', studentLevel: '零基础', totalLessons: '144', courseType: '音乐启蒙', teachingStyle: '奥尔夫体系', lessonDuration: '30分钟', extra: '' },
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => setForm({ ...preset })}
                  className="w-full text-left px-3 py-2.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右：输出区 */}
        <div className="flex-1 min-w-0">
          {outline ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400')} />
                  <span className="text-sm font-bold text-slate-800">
                    {loading ? 'AI 生成中...' : '大纲已生成'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50"
                  >
                    <RotateCcw size={12} /> 重新生成
                  </button>
                  {done && (
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all"
                    >
                      <Download size={12} /> 导出
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                <div className="font-sans text-sm text-slate-700 leading-relaxed space-y-0.5">
                  {outline.split('\n').map((line, i) => {
                    const lessonMatch = line.match(/第(\d+)课[^\|｜]*[\|｜]\s*([^\|｜]+)/)
                    const lessonTitle = lessonMatch ? lessonMatch[2].trim() : null
                    return (
                      <div key={i} className={`flex items-start gap-2 group ${lessonTitle ? 'hover:bg-indigo-50/60 -mx-2 px-2 py-0.5 rounded-lg' : ''}`}>
                        <pre className="whitespace-pre-wrap flex-1">{line || ' '}</pre>
                        {lessonTitle && !loading && (
                          <button
                            onClick={() => navigate(`/lesson-plan?topic=${encodeURIComponent(lessonTitle)}&subject=${encodeURIComponent(form.courseType)}&level=${encodeURIComponent(form.studentLevel)}`)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-2 py-0.5 font-semibold transition-all"
                            title={`为「${lessonTitle}」生成教案`}
                          >
                            <FileText size={10} /> 生成教案
                          </button>
                        )}
                      </div>
                    )
                  })}
                  {loading && <span className="inline-block w-0.5 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle" />}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-96 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                <Plus size={28} className="text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-2">配置课程参数，生成大纲</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                选择左侧参数后点击「生成课程大纲」，AI 将自动为您生成完整的体系化课程目录，包含每课次的课题、知识点和教学目标。
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {['奥尔夫', '柯达伊', '达尔克罗兹', '铃木教学法'].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 bg-slate-50 text-slate-400 rounded-full border border-slate-100">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
