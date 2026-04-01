import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FilePlus, Users, TrendingUp, ArrowRight, Plus, Activity, Sparkles, ChevronRight } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { getLessons } from '@/lib/lessonStorage'
import { getStudents, type Student } from '@/lib/studentsData'

const areaData = [
  { name: '1月', 教案数: 52 },
  { name: '2月', 教案数: 78 },
  { name: '3月', 教案数: 91 },
  { name: '4月', 教案数: 67 },
  { name: '5月', 教案数: 105 },
  { name: '6月', 教案数: 128 },
]

const barData = [
  { name: '钢琴', 课程数: 68 },
  { name: '声乐', 课程数: 34 },
  { name: '古筝', 课程数: 18 },
  { name: '小提琴', 课程数: 12 },
  { name: '吉他', 课程数: 9 },
]

function formatAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  return `${Math.floor(hours / 24)} 天前`
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const lessons = getLessons()
  const allStudents = getStudents()
  const activeStudents = allStudents.filter((s: Student) => s.status === 'active').length

  const stats = [
    { name: '教案总数', value: String(lessons.length || 0), icon: FilePlus, trend: '+12%' },
    { name: '在读学生', value: String(activeStudents), icon: Users, trend: '+3' },
    { name: '服务机构', value: '45', icon: Activity, trend: '+1' },
    { name: '效率提升', value: '42%', icon: TrendingUp, trend: '↑ 5%' },
  ]

  const activities = lessons.slice(0, 4).map((l) => ({
    id: l.id,
    title: `《${l.title}》已同步`,
    time: formatAgo(l.createdAt),
    subject: l.subject,
  }))

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-20 pt-4 lg:px-6">
      <div className="ambient-glow left-[-80px] top-[10%] h-[260px] w-[260px] bg-premium-purple/18 animate-drift" />
      <div className="ambient-glow bottom-[10%] right-[-40px] h-[220px] w-[220px] bg-sky-300/20 animate-float-slow" />

      <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-8">
        <section className="premium-glass relative overflow-hidden px-8 py-10 lg:px-12 lg:py-14">
          <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-premium-purple/10 via-transparent to-transparent" />
          <div className="absolute -right-20 top-10 h-48 w-48 rounded-full bg-premium-purple/15 blur-3xl animate-breathe-slow" />
          <motion.div variants={item} className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-4">
                <span className="mono-label">Living dashboard / 2026</span>
                <div className="h-2 w-2 rounded-full bg-premium-purple animate-pulse" />
              </div>
              <h1 className="hero-text leading-[1.1]">
                白色空间里，<strong>让教研系统开始呼吸。</strong>
              </h1>
              <p className="max-w-2xl text-[17px] leading-8 text-slate-500">
                我们把界面切换为轻盈的白色玻璃质感，并通过环境光、漂浮渐变和节奏动效，
                让仪表盘既清爽克制，又有持续流动的生命感。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/lesson-plan" className="apple-btn">
                <Plus size={18} strokeWidth={2.8} />
                开始智能教研
              </Link>
              <button onClick={() => navigate('/teaching-research')} className="ghost-btn">
                查看教研库
              </button>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, index) => (
            <motion.div
              key={s.name}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              className="premium-glass group relative overflow-hidden p-7 transition-all hover:shadow-[0_32px_64px_rgba(110,44,242,0.12)]"
            >
              <div className="relative z-10 flex items-start justify-between">
                <div className="secondary-glass flex h-14 w-14 items-center justify-center rounded-[22px] bg-white/70 text-slate-700 transition-colors group-hover:bg-premium-purple group-hover:text-white">
                  <s.icon size={20} />
                </div>
                <span className="rounded-full bg-premium-purple/10 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-premium-purple transition-colors group-hover:bg-white/20 group-hover:text-white">
                  {s.trend}
                </span>
              </div>
              <div className="relative z-10 mt-10 space-y-2">
                <p className="mono-label text-slate-400 transition-colors group-hover:text-white/70">{s.name}</p>
                <h3 className="text-4xl font-black tabular-nums tracking-tight text-slate-900 transition-colors group-hover:text-white">
                  {s.value}
                </h3>
              </div>

              <div className="absolute inset-0 z-0 bg-gradient-to-br from-premium-purple to-indigo-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-6 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.div variants={item} className="premium-glass lg:col-span-8 p-8 lg:p-10">
            <div className="mb-10 flex items-center justify-between gap-4">
              <div>
                <h2 className="section-title">
                  教研动态<span className="font-black">趋势.</span>
                </h2>
                <p className="mono-label mt-2 text-slate-400">6-Month analytics intelligence</p>
              </div>
              <div className="secondary-glass rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-premium-purple">
                Growth +24%
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="premiumGradientLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6e2cf2" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="#6e2cf2" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255,255,255,0.92)',
                      border: '1px solid rgba(255,255,255,0.82)',
                      borderRadius: '20px',
                      boxShadow: '0 22px 44px rgba(15,23,42,0.10)',
                      backdropFilter: 'blur(18px)',
                      color: '#0f172a',
                    }}
                    labelStyle={{ color: '#64748b', fontSize: '11px' }}
                    itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 700 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="教案数"
                    stroke="#6e2cf2"
                    strokeWidth={3}
                    fill="url(#premiumGradientLight)"
                    dot={{ r: 4, fill: '#ffffff', stroke: '#6e2cf2', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#6e2cf2', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-4 space-y-6">
            <div className="premium-glass flex flex-col p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="section-title text-[1.55rem]">
                    近期<span className="font-black">日志.</span>
                  </h2>
                  <p className="mono-label mt-2 text-slate-400">System activity log</p>
                </div>
                <div className="secondary-glass rounded-full bg-white/70 px-4 py-2 text-[10px] font-semibold text-slate-400">
                  REAL-TIME
                </div>
              </div>
              <div className="mt-8 space-y-3">
                {activities.length > 0 ? (
                  activities.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => navigate(`/my-lessons`)}
                      className="secondary-glass group/item flex cursor-pointer items-center justify-between rounded-[22px] px-4 py-4 transition-all hover:bg-white/95 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-slate-700 transition-colors group-hover/item:text-premium-purple">
                          {a.title}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">{a.time}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 transition-transform group-hover/item:translate-x-1 group-hover/item:text-premium-purple" />
                    </div>
                  ))
                ) : (
                  <div className="secondary-glass rounded-[22px] px-4 py-8 text-center text-sm text-slate-400">
                    还没有保存过教案，先去生成一份吧。
                  </div>
                )}
              </div>
            </div>

            <div className="premium-glass relative overflow-hidden p-8">
              <div className="absolute right-[-20px] top-[-10px] h-40 w-40 rounded-full bg-premium-purple/14 blur-3xl animate-float-slow" />
              <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-between">
                <div>
                  <div className="secondary-glass mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-premium-purple">
                    <Sparkles size={12} /> 高级教研流
                  </div>
                  <h3 className="text-[2rem] font-light leading-tight tracking-[-0.05em] text-slate-900">
                    更明亮，<br />
                    更轻盈的<span className="font-black">智能教案.</span>
                  </h3>
                  <p className="mt-4 max-w-[220px] text-[13px] leading-6 text-slate-500">
                    用更柔和的光、更多留白和更低噪点，持续强化“专业且有温度”的品牌观感。
                  </p>
                </div>
                <button onClick={() => navigate('/lesson-plan')} className="ghost-btn w-fit">
                  立即探索 <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.div variants={item} className="premium-glass lg:col-span-7 p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="section-title text-[1.6rem]">
                  科目<span className="font-black">分布.</span>
                </h2>
                <p className="mono-label mt-2 text-slate-400">Course structure overview</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255,255,255,0.92)',
                      border: '1px solid rgba(255,255,255,0.82)',
                      borderRadius: '18px',
                      boxShadow: '0 22px 44px rgba(15,23,42,0.10)',
                      color: '#0f172a',
                    }}
                  />
                  <Bar dataKey="课程数" fill="#2196f3" radius={[12, 12, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={item} className="premium-glass lg:col-span-5 p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="secondary-glass flex h-12 w-12 items-center justify-center rounded-[20px] bg-white/78 text-premium-purple">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="mono-label text-slate-400">Ambient design note</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">生命感来自节奏，不来自噪音</h3>
              </div>
            </div>
            <div className="mt-8 space-y-4 text-[14px] leading-7 text-slate-500">
              <p>这次改造把深色高对比界面，转成了白色、雾感、柔发光的层级体系。</p>
              <p>环境光随着鼠标轻微移动，卡片保留升起和呼吸节奏，让系统像一个持续工作的设计对象，而不是静态表单。</p>
              <p>如果你愿意，我下一步可以继续把 <span className="font-semibold text-slate-700">学生管理、设置页、我的教案库</span> 也统一到同一套白色生命感语言。</p>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  )
}
