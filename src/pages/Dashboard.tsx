import { Link, useNavigate } from 'react-router-dom'
import { FilePlus, Users, TrendingUp, ArrowRight, Plus, Zap } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { getLessons } from '@/lib/lessonStorage'
import { STUDENTS } from '@/lib/studentsData'

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

export default function Dashboard() {
  const navigate = useNavigate()
  const lessons = getLessons()
  const activeStudents = STUDENTS.filter(s => s.status === 'active').length

  const stats = [
    { name: '已保存教案数', value: String(lessons.length || 0), change: lessons.length > 0 ? `最近：${formatAgo(lessons[0]?.createdAt)}` : '暂无教案', up: true, icon: FilePlus, iconColor: 'text-blue-600', bg: 'bg-blue-50' },
    { name: '在读学生总数', value: String(activeStudents), change: `共 ${STUDENTS.length} 人`, up: true, icon: Users, iconColor: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: '服务机构数', value: '45', change: '+3 家', up: true, icon: Users, iconColor: 'text-purple-600', bg: 'bg-purple-50' },
    { name: '效率综合提升', value: '42%', change: '↑ 5% vs 上周', up: true, icon: TrendingUp, iconColor: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  // 最近动态：优先显示真实教案记录，不足时补占位
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
    <div className="max-w-6xl mx-auto space-y-7">
      {/* 顶部 */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-indigo-500 mb-1 tracking-widest uppercase">音智 AI 教研中心</p>
          <h1 className="text-2xl font-bold text-slate-900">下午好，音智教研组 👋</h1>
          <p className="mt-1 text-slate-500 text-sm">
            {lessons.length > 0
              ? `教案库共 ${lessons.length} 份，${activeStudents} 位学生在读`
              : `${activeStudents} 位学生在读，还没有保存过教案`}
          </p>
        </div>
        <Link
          to="/lesson-plan"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
        >
          <Plus size={16} /> 创建新教案
        </Link>
      </div>

      {/* 数据卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.name} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${s.bg} group-hover:scale-110 transition-transform`}>
                <s.icon size={18} className={s.iconColor} />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full text-emerald-600 bg-emerald-50">
                {s.change}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-1">{s.name}</p>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* 图表区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">教案生成趋势</h2>
              <p className="text-xs text-slate-400 mt-0.5">近 6 个月</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">月均 87 份</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorLesson" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }} />
              <Area type="monotone" dataKey="教案数" stroke="#4f46e5" strokeWidth={2.5} fill="url(#colorLesson)" dot={{ fill: '#4f46e5', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-slate-900">科目分布</h2>
            <p className="text-xs text-slate-400 mt-0.5">本月课程数</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} layout="vertical" barSize={10}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }} cursor={false} />
              <Bar dataKey="课程数" fill="#4f46e5" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 底部 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 最近动态 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h2 className="text-sm font-bold text-slate-900">最近动态</h2>
            <Link to="/my-lessons" className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline">
              查看教案库 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {activities.length > 0 ? activities.map((a) => (
              <div
                key={a.id}
                onClick={() => a.lessonId && navigate('/my-lessons')}
                className={`p-4 flex items-center gap-3 transition-colors ${a.lessonId ? 'hover:bg-slate-50/80 cursor-pointer' : 'hover:bg-slate-50/50'}`}
              >
                <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {a.user}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{a.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
                {a.lessonId && <ArrowRight size={13} className="text-slate-300 shrink-0" />}
              </div>
            )) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                暂无动态，<Link to="/lesson-plan" className="text-indigo-500 hover:underline">去生成第一份教案</Link>
              </div>
            )}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="space-y-3">
          <Link to="/lesson-plan" className="block p-5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-indigo-200" />
              <span className="text-xs font-bold text-indigo-200">AI 教案生成</span>
            </div>
            <p className="font-bold">立即创建教案</p>
            <p className="text-indigo-100 text-xs mt-1 leading-relaxed">输入曲目，60 秒内生成专业标准化教案</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-white/80 group-hover:gap-2 transition-all">
              开始 <ArrowRight size={12} />
            </div>
          </Link>

          <button
            onClick={() => {
              // 带最近活跃学生跳转家校沟通
              const recent = STUDENTS.find(s => s.status === 'active')
              if (recent) navigate(`/communication?studentId=${recent.id}`)
              else navigate('/communication')
            }}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group text-left"
          >
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 text-xl">💬</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">家校沟通文案</p>
              <p className="text-xs text-slate-400 mt-0.5">关键词 → 专业反馈</p>
            </div>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-all shrink-0" />
          </button>

          <Link to="/students" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 text-xl">👤</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">学生管理</p>
              <p className="text-xs text-slate-400 mt-0.5">{activeStudents} 位在读 · 点击查看档案</p>
            </div>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-all shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  )
}
