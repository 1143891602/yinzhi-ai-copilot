import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Send,
  Sparkles,
  Smile,
  History,
  CheckCircle2,
  Mic,
  Activity,
  Zap,
  Star,
  User,
} from 'lucide-react'
import { streamChat } from '@/lib/ai'
import { cn } from '@/lib/utils'

const PERSONAS = [
  { id: 'warm', name: '亲切', desc: '语气像家人', icon: Smile, color: 'text-amber-500' },
  { id: 'pro', name: '专业', desc: '注重反馈', icon: Activity, color: 'text-premium-purple' },
  { id: 'concise', name: '简洁', desc: '汇报结论', icon: Zap, color: 'text-emerald-500' },
]

export default function Communication() {
  const [studentName, setStudentName] = useState('')
  const [lessonContent, setLessonContent] = useState('')
  const [persona, setPersona] = useState('warm')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!studentName || !lessonContent) return
    setIsGenerating(true)
    setResult('')

    const personaDesc = PERSONAS.find((p) => p.id === persona)?.name
    const prompt = `你是一位专业的音乐老师。请根据以下信息，写一段发给家长的课后反馈。
    学生姓名：${studentName}
    本课内容：${lessonContent}
    要求语气：${personaDesc}

    要求：
    1. 包含学生的优点和进步。
    2. 指出需要加强练习的地方。
    3. 给出具体的练习建议。
    4. 结尾要温暖且有力量。
    5. 不要太长，控制在200字以内。`

    let fullText = ''
    try {
      await streamChat([{ role: 'user', content: prompt }], (chunk) => {
        fullText += chunk
        setResult(fullText)
      })
    } catch (e) {
      console.error(e)
      setResult('生成失败，请检查 API 配置。')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative mx-auto max-w-7xl space-y-8 px-4 pb-20 pt-4 lg:px-6">
      <div className="ambient-glow left-[8%] top-[15%] h-[240px] w-[240px] bg-amber-200/14 animate-drift" />
      <div className="ambient-glow right-[12%] top-[25%] h-[220px] w-[220px] bg-premium-purple/10 animate-float-slow" />

      <section className="premium-glass relative overflow-hidden px-8 py-10 lg:px-10">
        <div className="absolute left-[10%] top-8 h-24 w-24 rounded-full bg-amber-300/20 blur-3xl animate-breathe-slow" />
        <div className="absolute right-[12%] top-10 h-20 w-20 rounded-full bg-premium-purple/14 blur-3xl animate-float-slow" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="secondary-glass flex h-14 w-14 items-center justify-center rounded-[22px] bg-white/80 text-amber-500">
            <MessageSquare size={22} />
          </div>
          <div>
            <p className="mono-label text-slate-400">Parent communication / AI Assistant</p>
            <h1 className="section-title text-[2.6rem]">
              家校<span className="font-black text-slate-900">连接.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="premium-glass lg:col-span-4 p-8">
          <div className="space-y-8">
            <div>
              <p className="mono-label mb-4 text-slate-400">学员姓名 / Student Name</p>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="在此输入学员姓名..."
                  className="w-full rounded-[24px] border border-white/90 bg-white/75 py-4 pl-12 pr-5 text-[14px] text-slate-700 outline-none transition-all focus:border-amber-400/40 focus:shadow-[0_14px_32px_rgba(251,191,36,0.14)]"
                />
              </div>
            </div>

            <div>
              <p className="mono-label mb-4 text-slate-400">学习要点 / Key Points</p>
              <textarea
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                placeholder="在此输入本课表现、重点及作业..."
                className="min-h-[170px] w-full rounded-[28px] border border-white/90 bg-white/75 p-5 text-[14px] leading-7 text-slate-700 outline-none transition-all resize-none focus:border-amber-400/40 focus:shadow-[0_14px_32px_rgba(251,191,36,0.14)]"
              />
            </div>

            <div>
              <p className="mono-label mb-4 text-slate-400">沟通风格 / Persona Style</p>
              <div className="grid grid-cols-3 gap-2">
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPersona(p.id)}
                    className={`rounded-[22px] border px-3 py-4 text-center transition-all duration-300 ${
                      persona === p.id
                        ? 'border-transparent bg-slate-900 text-white shadow-soft'
                        : 'border-white/90 bg-white/65 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <p.icon size={18} className={`mx-auto ${persona === p.id ? 'text-white' : p.color}`} />
                    <span className="mt-3 block text-[11px] font-semibold tracking-tight">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={generate} disabled={isGenerating || !studentName || !lessonContent} className="apple-btn mt-8 w-full">
            {isGenerating ? (
              <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <>
                <Sparkles size={18} strokeWidth={2.8} /> 生成反馈内容
              </>
            )}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8">
          <div className="premium-glass flex min-h-[620px] flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200/80 px-8 py-5">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'}`} />
                <span className="mono-label text-slate-400">
                  {isGenerating ? '正在温暖地构思反馈...' : '反馈内容已生成'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="btn-futuristic h-11 w-11 rounded-2xl p-0">
                  <History size={16} />
                </button>
                <button className="btn-futuristic h-11 w-11 rounded-2xl p-0">
                  <Star size={16} />
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto px-10 py-12 no-scrollbar">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative max-w-3xl whitespace-pre-wrap text-[16px] leading-8 text-slate-600"
                  >
                    {result}
                    {isGenerating && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block ml-1 h-5 w-1 bg-amber-400 align-middle"
                      />
                    )}
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                    <div className="secondary-glass flex h-24 w-24 items-center justify-center rounded-[30px] bg-white/70">
                      <Mic size={36} strokeWidth={1.4} />
                    </div>
                    <p className="mono-label mt-8 text-slate-400">等待智能输入与反馈构思...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {result && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between border-t border-slate-200/80 px-8 py-5">
                <div className="flex items-center gap-3 text-slate-500">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="mono-label text-slate-400">AI 安全性检查已通过</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={cn(
                    'ghost-btn transition-all duration-300 min-w-[140px] justify-center',
                    copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''
                  )}
                >
                  {copied ? '已复制到剪贴板' : '复制反馈内容'}
                  {copied ? <CheckCircle2 size={13} strokeWidth={2.5} className="ml-2" /> : <Send size={13} strokeWidth={2.5} className="ml-2" />}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
