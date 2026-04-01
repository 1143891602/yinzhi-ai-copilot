import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FilePlus, Users, TrendingUp, ArrowRight, Plus, Zap, Activity, PieChart, Sparkles } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
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

const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500']

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const lessons = getLessons()
  const allStudents = getStudents()
  const activeStudents = allStudents.filter((s: Student) => s.status === 'active').length

  const stats = [
    { name: '已保存教案数', value: String(lessons.length || 0), change: lessons.length > 0 ? `最近：${formatAgo(lessons[0]?.createdAt)}` : '暂无教案', up: true, icon: FilePlus, iconColor: 'text-blue-600', bg: 'bg-blue-50' },
    { name: '在读学生总数', value: String(activeStudents), change: `共 ${allStudents.length} 人`, up: true, icon: Users, iconColor: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: '服务机构数', value: '45', change: '+3 家', up: true, icon: Users, iconColor: 'text-purple-600', bg: 'bg-purple-50' },
    { name: '效率综合提升', value: '42%', change: '↑ 5% vs 上周', up: true, icon: TrendingUp, iconColor: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  const recentActivities = lessons.slice(0, 4).map((l, i) => ({
    id: l.id,
    title: `《${l.title}》${l.subject}教案已保存`,
    time: formatAgo(l.createdAt),
    user: l.subject[0] || '案',
    color: avatarColors[i % avatarColors.length],
    lessonId: l.id,
  }))

  const placeholders = [
    { id: 'p1', title: '教研库更新：现代少儿声乐发声练习曲', time: '昨天', user: '系', color: 'bg-slate-400', lessonId: null },
    { id: 'p2', title: '新增家校回访：王小明 5 级钢琴辅导方案', time: '2 天前', user: '张', color: 'bg-purple-500', lessonId: null },
  ]

  const activities = [...recentActivities, ...placeholders].slice(0, 4)

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* 顶部 */}
      <div className="flex items-end justify-between">
        <motion.div variants={item}>
          <p className="text-[10px] font-bold text-indigo-500 mb-1.5 tracking-[0.25em] uppercase">音智 AI 教研中心</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">下午好，音智教研组 👋</h1>
          <p className="mt-1 text-slate-500 text-sm font-medium">
            {lessons.length > 0
              ? `教案库共 ${lessons.length} 份，${activeStudents} 位学生在读`
              : `${activeStudents} 位学生在读，还没有保存过教案`}
          </p>
        </motion.div>
        <motion.div variants={item}>
          <Link
            to="/lesson-plan"
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={18} strokeWidth={3} /> 创建新教案
          </Link>
        </motion.div>
      </div>

      {/* 数据卡片 */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.name} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-150 transition-transform duration-500">
              <s.icon size={80} />
            </div>
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className={`p-3 rounded-2xl ${s.bg} group-hover:scale-110 transition-transform duration-300`}>
                <s.icon size={20} className={s.iconColor} />
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-emerald-600 bg-emerald-50 tracking-wide">
                {s.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{s.name}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* 图表区 */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <Activity size={120} />
          </div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">教案生成趋势</h2>
              <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">近 6 个月活跃度</p>
            </div>
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">月均 87 份</span>
          </div>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorLesson" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 700 }} />
                <Area type="monotone" dataKey="教案数" stroke="#4f46e5" strokeWidth={4} fill="url(#colorLesson)" dot={{ fill: '#4f46e5', r: 5, strokeWidth: 0 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <PieChart size={120} />
          </div>
          <div className="mb-8 relative z-10">
            <h2 className="text-base font-black text-slate-900 tracking-tight">科目分布</h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">本月教研覆盖度</p>
          </div>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} layout="vertical" barSize={12} margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 700 }} cursor={false} />
                <Bar dataKey="课程数" fill="#4f46e5" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* 底部 */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近动态 */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-slate-50">
            <h2 className="text-base font-black text-slate-900 tracking-tight">最近动态</h2>
            <Link to="/my-lessons" className="text-xs font-black text-indigo-600 flex items-center gap-1.5 hover:gap-2 transition-all uppercase tracking-wider">
              查看全部 <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {activities.length > 0 ? activities.map((a) => (
              <div
                key={a.id}
                onClick={() => a.lessonId && navigate('/my-lessons')}
                className={`p-5 flex items-center gap-4 transition-colors ${a.lessonId ? 'hover:bg-slate-50 cursor-pointer' : 'hover:bg-slate-50/50'}`}
              >
                <div className={`w-10 h-10 rounded-2xl ${a.color} flex items-center justify-center text-white text-xs font-black shadow-lg shadow-current/10 shrink-0`}>
                  {a.user}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate leading-snug">{a.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{a.time}</p>
                </div>
                {a.lessonId && <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors"><ArrowRight size={14} className="text-slate-300 shrink-0" /></div>}
              </div>
            )) : (
              <div className="p-12 text-center text-slate-400 text-sm font-bold">
                暂无动态，<Link to="/lesson-plan" className="text-indigo-500 hover:underline">去生成第一份教案</Link>
              </div>
            )}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="space-y-4">
          <Link to="/lesson-plan" className="block p-7 bg-indigo-600 rounded-[32px] text-white shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">智能教研</span>
            </div>
            <p className="text-xl font-black mb-1 relative z-10">立即生成专业教案</p>
            <p className="text-indigo-100/70 text-xs font-medium leading-relaxed relative z-10">输入曲目，60 秒内生成标准化教学方案</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-black text-white relative z-10">
              开始生成 <div className="p-1 bg-white/20 rounded-lg group-hover:translate-x-1 transition-transform"><ArrowRight size={12} strokeWidth={3} /></div>
            </div>
          </Link>

          <button
            onClick={() => {
              const recent = allStudents.find((s: Student) => s.status === 'active')
              if (recent) navigate(`/communication?studentId=${recent.id}`)
              else navigate('/communication')
            }}
            className="w-full flex items-center gap-5 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all group text-left"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 text-2xl group-hover:scale-110 transition-transform">💬</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800">家校沟通反馈</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">AI 自动整理话术</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors"><ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-all" strokeWidth={3} /></div>
          </button>

          <Link to="/students" className="flex items-center gap-5 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 text-2xl group-hover:scale-110 transition-transform">👤</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800">学生档案库</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{activeStudents} 位在读活跃</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors"><ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-all" strokeWidth={3} /></div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
