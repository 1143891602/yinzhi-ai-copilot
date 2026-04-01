import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sparkles, Copy, Check, RefreshCw, Users, Heart, ShieldCheck, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { streamChat } from '@/lib/ai'
import { getStudents, getStudentTags } from '@/lib/studentsData'

type Style = 'warm' | 'professional' | 'concise'

const STYLES: { id: Style; name: string; icon: any; color: string; desc: string }[] = [
  { id: 'warm', name: '温情鼓励', icon: Heart, color: 'text-rose-500 bg-rose-50', desc: '语气亲切，多用表情包，侧重夸奖进步' },
  { id: 'professional', name: '专业严谨', icon: ShieldCheck, color: 'text-indigo-500 bg-indigo-50', desc: '术语规范，侧重指法、节奏等客观评价' },
  { id: 'concise', name: '简洁高效', icon: Zap, color: 'text-amber-500 bg-amber-50', desc: '100字以内，重点突出，适合微信快速预览' },
]

export default function Communication() {
  const [searchParams] = useSearchParams()
  const students = getStudents()
  const [selected, setSelected] = useState<typeof students[0] | null>(null)
  const [keywords, setKeywords] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [fromStudent, setFromStudent] = useState(false)
  const [style, setStyle] = useState<Style>('warm')

  useEffect(() => {
    const studentId = searchParams.get('studentId')
    const kw = searchParams.get('keywords')
    if (studentId) {
      const found = students.find(s => s.id === Number(studentId))
      if (found) {
        setSelected(found)
        setFromStudent(true)
        if (kw) {
          setKeywords(decodeURIComponent(kw))
        } else {
          const tags = getStudentTags(found.id)
          if (tags.length) setKeywords(tags.join('、'))
        }
      }
    }
  }, [])

  const generate = async () => {
    if (!selected) return
    setGenerating(true)
    setResult('')

    const tags = getStudentTags(selected.id)
    const tagLine = tags.length ? `\n学生特点标签：${tags.join('、')}` : ''

    const stylePrompts = {
      warm: '你是一位非常有爱心、善于发现孩子闪光点的音乐老师。请写一段充满鼓励、亲切且带有一些可爱表情包的课后评价。',
      professional: '你是一位严谨、专业的资深教研总监。请使用音乐专业术语，对孩子的课堂表现进行客观、深度且条理清晰的评价。',
      concise: '你是一位高效、直接的老师。请用 100 字以内的短句，快速概括孩子本次课堂的重点和需要改进的地方，适合家长在微信预览。'
    }

    const prompt = `${stylePrompts[style]}
请根据以下信息，生成一段发给家长的课后反馈文案。

学生姓名：${selected.name}
学习乐器：${selected.instrument}
当前级别：${selected.level}
本次课堂关键词：${keywords || '上课认真，有进步'}${tagLine}

要求：
1. 直接输出文案内容，不要前言和结语。
2. 包含：本节课亮点、待提升点、回家练习建议。
3. 结构清晰，排版精美。`

    await streamChat(
      [{ role: 'user', content: prompt }],
      (chunk) => {
        setResult(prev => prev + chunk)
      },
      () => setGenerating(false)
    )
  }

  function handleCopy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full overflow-hidden">
      <div className="mb-6">
        <p className="text-xs font-semibold text-indigo-500 mb-1 tracking-widest uppercase">Communication</p>
        <h1 className="text-2xl font-bold text-slate-900">智能家校沟通</h1>
        <p className="mt-1 text-slate-500 text-sm">选择学员，AI 自动生成专业、有温度的课后反馈，提升家长满意度。</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* 左：配置区 */}
        <div className="w-80 space-y-4 flex flex-col">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Users size={13} /> 选择学员
              </label>
              <select
                value={selected?.id || ''}
                onChange={e => {
                  const s = students.find(s => s.id === Number(e.target.value))
                  setSelected(s || null)
                  if (s) {
                    const tags = getStudentTags(s.id)
                    setKeywords(tags.join('、'))
                  }
                }}
                className="w-full appearance-none bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">点击选择学生</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.instrument})</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">本节课表现关键词</label>
              <textarea
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="如：识谱快、错音较多、节奏稳..."
                rows={3}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <label className="text-xs font-bold text-slate-500">评价风格</label>
            <div className="space-y-2">
              {STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group",
                    style === s.id ? "bg-indigo-50 ring-1 ring-indigo-100" : "hover:bg-slate-50"
                  )}
                >
                  <div className={cn("mt-0.5 p-2 rounded-lg transition-all", style === s.id ? s.color : "bg-slate-100 text-slate-400 group-hover:bg-slate-200")}>
                    <s.icon size={16} />
                  </div>
                  <div>
                    <p className={cn("text-xs font-bold", style === s.id ? "text-indigo-600" : "text-slate-600")}>{s.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!selected || generating}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
          >
            {generating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {generating ? '正在构思反馈文案...' : '生成课后评价'}
          </button>
        </div>

        {/* 右：输出区 */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", generating ? "bg-amber-400 animate-pulse" : result ? "bg-emerald-400" : "bg-slate-200")} />
              <span className="text-sm font-bold text-slate-800">
                {generating ? 'AI 正在生成...' : result ? '反馈文案已生成' : '等待生成...'}
              </span>
            </div>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? '已复制' : '复制文案'}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-8 relative">
            {result ? (
              <div className="prose prose-slate max-w-none prose-sm">
                <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-sm">
                  {result}
                  {generating && <span className="inline-block w-0.5 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle" />}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Sparkles size={48} className="text-slate-200 mb-4" />
                <p className="text-sm font-medium text-slate-400">配置左侧信息后，点击“生成评价”</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
