import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  Phone,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { addStudent, deleteStudent, getStudents, type Student } from '@/lib/studentsData'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

const instruments = ['钢琴', '声乐', '古筝', '小提琴', '吉他']
const levels = ['初级', '中级', '高级', '考级班']
const teachers = ['张老师', '李老师', '王老师', '刘老师']

function statusMeta(status: Student['status']) {
  return status === 'active'
    ? {
        label: '在读中',
        chip: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      }
    : {
        label: '已暂停',
        chip: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-400',
      }
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    instrument: '钢琴',
    level: '初级',
    age: 8,
    phone: '',
    teacher: '张老师',
    status: 'active' as const,
    avatar: 'A',
    nextExam: '2026-08',
  })

  useEffect(() => {
    const data = getStudents()
    setStudents(data)
    if (data.length > 0) setSelectedStudent(data[0])
  }, [])

  const handleAdd = () => {
    const normalizedName = newStudent.name.trim()
    if (!normalizedName) return

    const student = addStudent({
      ...newStudent,
      name: normalizedName,
      avatar: normalizedName[0] || 'A',
    })

    setStudents((prev) => [student, ...prev])
    setSelectedStudent(student)
    setIsAdding(false)
    setNewStudent({
      name: '',
      instrument: '钢琴',
      level: '初级',
      age: 8,
      phone: '',
      teacher: '张老师',
      status: 'active',
      avatar: 'A',
      nextExam: '2026-08',
    })
  }

  const handleDelete = (id: number) => {
    deleteStudent(id)
    const nextStudents = students.filter((student) => student.id !== id)
    setStudents(nextStudents)
    if (selectedStudent?.id === id) {
      setSelectedStudent(nextStudents[0] || null)
    }
  }

  const filteredStudents = students.filter((student) => {
    const keyword = searchTerm.toLowerCase()
    return (
      student.name.toLowerCase().includes(keyword) ||
      student.instrument.toLowerCase().includes(keyword) ||
      student.teacher.toLowerCase().includes(keyword)
    )
  })

  const radarData = selectedStudent?.scores
    ? [
        { subject: '技术能力', value: selectedStudent.scores.intonation, fullMark: 100 },
        { subject: '音乐表现', value: selectedStudent.scores.expression, fullMark: 100 },
        { subject: '乐理基础', value: selectedStudent.scores.reading, fullMark: 100 },
        { subject: '节奏感知', value: selectedStudent.scores.rhythm, fullMark: 100 },
        { subject: '练习投入', value: selectedStudent.scores.diligence, fullMark: 100 },
      ]
    : []

  const activeCount = students.filter((student) => student.status === 'active').length
  const pausedCount = students.filter((student) => student.status === 'pause').length
  const averageProgress = students.length
    ? Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length)
    : 0
  const standoutCount = students.filter((student) => student.progress >= 80).length

  const selectedStatus = selectedStudent ? statusMeta(selectedStudent.status) : null

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-20 pt-4 lg:px-6">
      <div className="ambient-glow left-[-90px] top-[8%] h-[280px] w-[280px] bg-emerald-300/20 animate-drift" />
      <div className="ambient-glow right-[-70px] top-[22%] h-[240px] w-[240px] bg-sky-300/18 animate-float-slow" />
      <div className="ambient-glow bottom-[-40px] left-[35%] h-[220px] w-[220px] bg-premium-purple/12 animate-breathe-slow" />

      <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-8">
        <motion.section variants={item} className="premium-glass relative overflow-hidden px-8 py-9 lg:px-10 lg:py-12">
          <div className="absolute inset-y-0 right-0 w-[38%] bg-gradient-to-l from-emerald-100/70 via-transparent to-transparent" />
          <div className="absolute right-[-30px] top-0 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl animate-float-slow" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="secondary-glass flex h-14 w-14 items-center justify-center rounded-[24px] bg-white/75">
                  <Users className="text-emerald-500" size={22} />
                </div>
                <div>
                  <p className="mono-label">Student intelligence / living archive</p>
                  <h1 className="hero-text mt-3 text-[clamp(2.6rem,6vw,4.8rem)]">
                    白色空间里，<br />
                    <strong>让学员成长轨迹更清晰。</strong>
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-[16px] leading-8 text-slate-500">
                用更轻的玻璃卡片、更柔和的高光和更自然的漂浮层次，把学员状态、能力维度和教学节奏放进一个有呼吸感的分析界面里。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setIsAdding(true)} className="apple-btn">
                <Plus size={18} strokeWidth={2.8} />
                录入新学员
              </button>
              <div className="ghost-btn rounded-full px-5">
                <Sparkles size={14} className="text-premium-purple" />
                档案实时同步本地数据
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: '在读学员', value: activeCount, accent: 'text-emerald-600 bg-emerald-100' },
              { label: '暂停观察', value: pausedCount, accent: 'text-amber-600 bg-amber-100' },
              { label: '平均进度', value: `${averageProgress}%`, accent: 'text-sky-600 bg-sky-100' },
              { label: '高潜力学员', value: standoutCount, accent: 'text-premium-purple bg-premium-purple/10' },
            ].map((stat) => (
              <div key={stat.label} className="secondary-glass rounded-[24px] px-5 py-5 bg-white/68">
                <div className="flex items-center justify-between gap-3">
                  <p className="mono-label text-slate-400">{stat.label}</p>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.18em] ${stat.accent}`}>
                    LIVE
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.div variants={item} className="premium-glass lg:col-span-4 overflow-hidden p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="section-title text-[1.65rem]">
                  学员<span className="font-black">列表.</span>
                </h2>
                <p className="mono-label mt-2 text-slate-400">{filteredStudents.length} profiles available</p>
              </div>
              <button onClick={() => setIsAdding(true)} className="btn-futuristic bg-emerald-50 text-emerald-700 border-emerald-100">
                <Plus size={15} />
                新建档案
              </button>
            </div>

            <div className="secondary-glass mt-6 flex items-center gap-3 rounded-[24px] px-4 py-4 bg-white/72">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="搜索姓名、乐器或老师..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-350"
              />
            </div>

            <div className="mt-6 flex max-h-[760px] flex-col gap-3 overflow-y-auto pr-1 no-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredStudents.map((student) => {
                  const meta = statusMeta(student.status)
                  const isActive = selectedStudent?.id === student.id

                  return (
                    <motion.button
                      key={student.id}
                      layout
                      variants={item}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      onClick={() => setSelectedStudent(student)}
                      className={`secondary-glass relative overflow-hidden rounded-[26px] p-5 text-left transition-all duration-300 ${
                        isActive
                          ? 'bg-white/85 ring-1 ring-emerald-200 shadow-[0_20px_40px_rgba(16,185,129,0.10)]'
                          : 'bg-white/58 hover:bg-white/74'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="student-active-marker"
                          className="absolute inset-y-6 left-0 w-1 rounded-full bg-emerald-500"
                        />
                      )}

                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 text-lg font-black text-white shadow-[0_16px_30px_rgba(16,185,129,0.22)]">
                            {student.avatar || student.name[0]}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${meta.dot}`} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="truncate text-base font-black text-slate-900">{student.name}</p>
                              <p className="mt-1 text-[11px] font-medium text-slate-400">
                                {student.instrument} · {student.teacher}
                              </p>
                            </div>
                            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] ${meta.chip}`}>
                              {student.level}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>{student.age} 岁</span>
                              <span className="h-1 w-1 rounded-full bg-slate-300" />
                              <span>{meta.label}</span>
                            </div>
                            <ChevronRight size={16} className={`transition-transform ${isActive ? 'text-emerald-500 translate-x-0.5' : 'text-slate-300'}`} />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>

              {filteredStudents.length === 0 && (
                <div className="secondary-glass rounded-[28px] px-6 py-14 text-center text-sm text-slate-400">
                  没有匹配到学员档案，试试更换搜索关键词。
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedStudent ? (
                <motion.div
                  key={selectedStudent.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  className="space-y-6"
                >
                  <div className="premium-glass relative overflow-hidden px-8 py-8 lg:px-10 lg:py-10">
                    <div className="absolute right-[-10px] top-[-20px] h-52 w-52 rounded-full bg-premium-purple/14 blur-3xl animate-breathe-slow" />
                    <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] ${selectedStatus?.chip}`}>
                            {selectedStatus?.label}
                          </span>
                          <span className="rounded-full bg-white/70 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-premium-purple">
                            profile focus
                          </span>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[0, 1, 2, 3, 4].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                fill="currentColor"
                                className={star < Math.round(selectedStudent.progress / 20) ? 'opacity-100' : 'opacity-25'}
                              />
                            ))}
                          </div>
                        </div>

                        <h2 className="mt-6 text-5xl font-black tracking-tight text-slate-900 lg:text-6xl">
                          {selectedStudent.name}
                        </h2>
                        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                          当前主修 {selectedStudent.instrument}，由 {selectedStudent.teacher} 负责带教。页面会把学习状态、能力结构与近期教学节奏放在同一视图里，方便快速判断下一步教学动作。
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                          {[
                            { label: '学习进度', value: `${selectedStudent.progress}%`, icon: TrendingUp },
                            { label: '入学时间', value: selectedStudent.joinDate, icon: Calendar },
                            { label: '下次考级', value: selectedStudent.nextExam, icon: Clock },
                            { label: '当前级别', value: selectedStudent.level, icon: GraduationCap },
                          ].map((metric) => (
                            <div key={metric.label} className="secondary-glass rounded-[24px] px-4 py-4 bg-white/66">
                              <div className="flex items-center justify-between gap-3">
                                <p className="mono-label text-slate-400">{metric.label}</p>
                                <metric.icon size={16} className="text-slate-400" />
                              </div>
                              <p className="mt-4 text-lg font-black text-slate-900">{metric.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button className="btn-futuristic bg-emerald-50 text-emerald-700 border-emerald-100">
                          <TrendingUp size={16} />
                          生成成长报告
                        </button>
                        <button
                          onClick={() => handleDelete(selectedStudent.id)}
                          className="btn-futuristic bg-rose-50 text-rose-600 border-rose-100 hover:shadow-[0_14px_30px_rgba(244,63,94,0.12)]"
                        >
                          <Trash2 size={16} />
                          移出档案
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10 mt-8 space-y-3">
                      <div className="flex items-center justify-between text-[12px] font-medium text-slate-500">
                        <span>本阶段完成度</span>
                        <span>{selectedStudent.progress}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 shadow-[0_0_24px_rgba(16,185,129,0.28)]"
                          style={{ width: `${selectedStudent.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <div className="premium-glass p-8 xl:col-span-6">
                      <div className="mb-8 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="section-title text-[1.55rem]">
                            能力<span className="font-black">维度.</span>
                          </h3>
                          <p className="mono-label mt-2 text-slate-400">Five-axis performance model</p>
                        </div>
                        <div className="secondary-glass flex h-11 w-11 items-center justify-center rounded-[18px] bg-white/68">
                          <Activity size={18} className="text-emerald-500" />
                        </div>
                      </div>

                      <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="78%" data={radarData}>
                            <PolarGrid stroke="rgba(148,163,184,0.18)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                              name={selectedStudent.name}
                              dataKey="value"
                              stroke="#10b981"
                              fill="#10b981"
                              fillOpacity={0.22}
                              strokeWidth={3}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="xl:col-span-6 space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="premium-glass p-7">
                          <div className="flex items-center justify-between">
                            <BookOpen size={22} className="text-premium-purple" />
                            <span className="mono-label">Teaching cue</span>
                          </div>
                          <h4 className="mt-8 text-2xl font-black tracking-tight text-slate-900">定制化教学大纲</h4>
                          <p className="mt-3 text-sm leading-7 text-slate-500">
                            基于当前五维分布，建议下一阶段优先补强节奏稳定性与视奏阅读，再推进更高难度曲目表达。
                          </p>
                        </div>

                        <div className="premium-glass p-7">
                          <div className="flex items-center justify-between">
                            <Award size={22} className="text-amber-500" />
                            <span className="mono-label">Growth pulse</span>
                          </div>
                          <h4 className="mt-8 text-2xl font-black tracking-tight text-slate-900">近期成长动态</h4>
                          <p className="mt-3 text-sm leading-7 text-slate-500">
                            过去一个周期内，练习投入与音准稳定度表现更好，适合安排一次更完整的汇报型课堂验证成果。
                          </p>
                        </div>
                      </div>

                      <div className="premium-glass p-7">
                        <div className="mb-6 flex items-center justify-between gap-4">
                          <div>
                            <h3 className="section-title text-[1.45rem]">
                              近期<span className="font-black">节奏.</span>
                            </h3>
                            <p className="mono-label mt-2 text-slate-400">Student operations snapshot</p>
                          </div>
                          <div className="secondary-glass rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                            updated locally
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {[
                            {
                              icon: Phone,
                              title: '家长联系',
                              value: selectedStudent.phone || '待补充联系方式',
                            },
                            {
                              icon: GraduationCap,
                              title: '主带老师',
                              value: selectedStudent.teacher,
                            },
                            {
                              icon: Calendar,
                              title: '入学月份',
                              value: selectedStudent.joinDate,
                            },
                            {
                              icon: Clock,
                              title: '考级节点',
                              value: selectedStudent.nextExam,
                            },
                          ].map((detail) => (
                            <div key={detail.title} className="secondary-glass rounded-[22px] px-4 py-4 bg-white/68">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-white/75">
                                  <detail.icon size={16} className="text-slate-500" />
                                </div>
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    {detail.title}
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-slate-700">{detail.value}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="premium-glass flex min-h-[620px] flex-col items-center justify-center px-8 text-center"
                >
                  <div className="secondary-glass mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/70">
                    <Users size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">请选择一位学员</h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                    左侧档案列表会实时映射本地存储中的学员数据，点击任一成员即可查看完整成长画像与教学线索。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAdding(false)}
                className="absolute inset-0 bg-slate-900/12 backdrop-blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="premium-glass relative z-10 w-full max-w-2xl overflow-hidden p-8 lg:p-10"
              >
                <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-emerald-300/16 blur-3xl animate-float-slow" />
                <div className="relative z-10 space-y-8">
                  <div className="text-center">
                    <p className="mono-label">Create new student profile</p>
                    <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900">录入新学员档案</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      用更简洁的表单建立学员身份、当前阶段和带教信息，录入后会直接写入本地档案库。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="md:col-span-2 space-y-2">
                      <label className="mono-label">姓名</label>
                      <input
                        type="text"
                        value={newStudent.name}
                        onChange={(event) => setNewStudent({ ...newStudent, name: event.target.value })}
                        placeholder="输入学员姓名..."
                        className="w-full rounded-[22px] border border-slate-200 bg-white/75 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="mono-label">联系电话</label>
                      <input
                        type="text"
                        value={newStudent.phone}
                        onChange={(event) => setNewStudent({ ...newStudent, phone: event.target.value })}
                        placeholder="家长手机号"
                        className="w-full rounded-[22px] border border-slate-200 bg-white/75 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="mono-label">年龄</label>
                      <input
                        type="number"
                        min={3}
                        max={99}
                        value={newStudent.age}
                        onChange={(event) => setNewStudent({ ...newStudent, age: Number(event.target.value) || 8 })}
                        className="w-full rounded-[22px] border border-slate-200 bg-white/75 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="mono-label">主修乐器</label>
                      <select
                        value={newStudent.instrument}
                        onChange={(event) => setNewStudent({ ...newStudent, instrument: event.target.value })}
                        className="w-full rounded-[22px] border border-slate-200 bg-white/75 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      >
                        {instruments.map((instrument) => (
                          <option key={instrument} value={instrument}>
                            {instrument}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="mono-label">当前级别</label>
                      <select
                        value={newStudent.level}
                        onChange={(event) => setNewStudent({ ...newStudent, level: event.target.value })}
                        className="w-full rounded-[22px] border border-slate-200 bg-white/75 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      >
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="mono-label">带教老师</label>
                      <select
                        value={newStudent.teacher}
                        onChange={(event) => setNewStudent({ ...newStudent, teacher: event.target.value })}
                        className="w-full rounded-[22px] border border-slate-200 bg-white/75 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      >
                        {teachers.map((teacher) => (
                          <option key={teacher} value={teacher}>
                            {teacher}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button onClick={() => setIsAdding(false)} className="ghost-btn w-full justify-center sm:flex-1">
                      取消
                    </button>
                    <button onClick={handleAdd} disabled={!newStudent.name.trim()} className="apple-btn w-full justify-center sm:flex-[1.4]">
                      确认创建档案
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
