import { useState } from 'react'
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { streamChat } from '@/lib/ai'

const students = [
  { id: 1, name: '王小明', instrument: '钢琴', level: '4 级' },
  { id: 2, name: '李佳琪', instrument: '钢琴', level: '2 级' },
  { id: 3, name: '张子涵', instrument: '声乐', level: '考级班' },
]


export default function Communication() {
  const [selected, setSelected] = useState<typeof students[0] | null>(null)
  const [keywords, setKeywords] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!selected) return
    setGenerating(true)
    setResult('')

    const prompt = `你是一名温情、专业的音乐教师助手。
请根据以下信息，生成一段发给家长的课后反馈文案。

学生姓名：${selected.name}
学习乐器：${selected.instrument}
当前级别：${selected.level}
本次课堂关键词：${keywords || '上课认真，有进步'}

要求：
- 语气温情、鼓励、专业
- 使用 emoji 增加亲切感
- 包含：课堂亮点 / 改进方向 / 本周练习任务 三个部分
- 控制在 200 字以内，适合家长直接阅读
- 直接输出文案，不要有任何前言`

    try {
      await streamChat(
        [{ role: 'user', content: prompt }],
        (chunk) => setResult((prev) => prev + chunk),
        () => setGenerating(false)
      )
    } catch (e) {
      console.error(e)
      setGenerating(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const quickTags = ['专注度高', '基本功扎实', '乐感极佳', '需多练习', '进步明显', '节奏感待加强']

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">智能家校沟通</h1>
        <p className="mt-1 text-slate-500 text-sm">输入简单关键词，AI 自动生成专业、温情的课后反馈文案，一键复制发送给家长。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧输入 */}
        <div className="space-y-4">
          {/* Step 1 选学生 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <p className="text-xs font-bold text-slate-500">STEP 1 · 选择学生</p>
            <div className="space-y-2">
              {students.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                    selected?.id === s.id
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/10'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                    selected?.id === s.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  )}>
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.instrument} · {s.level}</p>
                  </div>
                  <Check size={16} className={cn('text-indigo-600 transition-all', selected?.id === s.id ? 'opacity-100' : 'opacity-0')} />
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 关键词 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <p className="text-xs font-bold text-slate-500">STEP 2 · 输入课堂关键词</p>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="例如：左手力度控制进步大、十六分音符仍需加强、专注度高..."
              className="w-full h-24 p-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
            <div className="flex flex-wrap gap-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setKeywords((prev) => prev ? prev + '、' + tag : tag)}
                  className="px-3 py-1 bg-slate-100 text-xs font-medium text-slate-600 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!selected || generating}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm transition-all shadow-lg',
              !selected || generating
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-100'
            )}
          >
            {generating ? <><RefreshCw size={15} className="animate-spin" /> AI 正在润色文案...</> : <><Sparkles size={15} /> 生成专业反馈文案</>}
          </button>
        </div>

        {/* 右侧结果 */}
        <div className="bg-slate-900 rounded-2xl p-5 flex flex-col relative overflow-hidden" style={{ minHeight: 480 }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />

          <div className="relative flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">AI 生成文案</span>
              </div>
              {result && (
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? '已复制' : '复制全文'}
                </button>
              )}
            </div>

            <div className="flex-1 bg-white/5 rounded-2xl p-5 overflow-y-auto">
              {!result && !generating && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                  <div className="text-4xl mb-3">✍️</div>
                  <p className="text-slate-300 font-semibold text-sm">准备就绪</p>
                  <p className="text-xs mt-1 leading-relaxed">选择学生并输入关键词，AI 将在此生成温情专业的家校沟通文案。</p>
                </div>
              )}
              {generating && (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/10 rounded-full w-3/4" />
                  <div className="h-4 bg-white/10 rounded-full w-1/2" />
                  <div className="h-4 bg-white/10 rounded-full w-5/6" />
                  <div className="h-24 bg-white/5 rounded-xl mt-4" />
                  <div className="h-4 bg-white/10 rounded-full w-2/3" />
                  <div className="h-4 bg-white/10 rounded-full w-4/5" />
                </div>
              )}
              {result && !generating && (
                <pre className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <span className="text-xs text-indigo-300">💝 以温情、鼓励、专业语气生成</span>
              <button className="text-xs font-bold text-indigo-400 hover:text-indigo-200">更换语气</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
