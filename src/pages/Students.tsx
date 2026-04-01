import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, ChevronRight, Music, Award, Calendar, Phone, Tag, X, Trash2, UserPlus, Check, Users, BookOpen, BarChart2, TrendingUp } from 'lucide-react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'
import { cn } from '@/lib/utils'
import { getStudents, saveStudents, addStudent, deleteStudent, updateStudentScores, type Student } from '@/lib/studentsData'

const TAGS_KEY = 'yinzhi_student_tags'
function getTagsMap(): Record<number, string[]> {
  try { return JSON.parse(localStorage.getItem(TAGS_KEY) || '{}') } catch { return {} }
}
function saveTagsMap(map: Record<number, string[]>) {
  localStorage.setItem(TAGS_KEY, JSON.stringify(map))
}

const PRESET_TAGS = ['节奏感强', '音准待提升', '识谱快', '练习认真', '表演欲强', '注意力集中', '手指灵活', '乐感好']
const INSTRUMENTS = ['钢琴', '声乐', '古筝', '小提琴', '吉他', '乐理']
const LEVELS = ['初级', '1 级', '2 级', '3 级', '4 级', '5 级', '6 级', '7 级', '8 级', '9 级', '10 级', '考级班']

const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500']
const instrColors: Record<string, string> = {
  '钢琴': 'text-blue-600 bg-blue-50',
  '声乐': 'text-purple-600 bg-purple-50',
  '古筝': 'text-emerald-600 bg-emerald-50',
  '小提琴': 'text-orange-600 bg-orange-50',
  '吉他': 'text-pink-600 bg-pink-50',
  '乐理': 'text-slate-600 bg-slate-50',
}

export default function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Student[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Student | null>(null)
  const [filter, setFilter] = useState('全部')
  const [tagsMap, setTagsMap] = useState<Record<number, string[]>>(getTagsMap)
  const [tagInput, setTagInput] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '', instrument: '钢琴', level: '初级', age: 8, phone: '', teacher: '张老师', status: 'active'
  })
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [editingScores, setEditingScores] = useState<Student['scores'] | undefined>(undefined)

  useEffect(() => {
    setStudents(getStudents())
  }, [])

  useEffect(() => { saveTagsMap(tagsMap) }, [tagsMap])

  function handleAddStudent() {
    if (!newStudent.name || !newStudent.phone) return
    const s = addStudent({
      name: newStudent.name!,
      instrument: newStudent.instrument!,
      level: newStudent.level!,
      age: Number(newStudent.age),
      phone: newStudent.phone!,
      teacher: newStudent.teacher!,
      status: 'active',
      avatar: newStudent.name![0],
      nextExam: '2025-06'
    })
    setStudents(getStudents())
    setShowAddModal(false)
    setNewStudent({ name: '', instrument: '钢琴', level: '初级', age: 8, phone: '', teacher: '张老师', status: 'active' })
    setSelected(s)
  }

  function handleUpdateScores() {
    if (!selected || !editingScores) return
    updateStudentScores(selected.id, editingScores)
    setStudents(getStudents())
    setSelected({ ...selected, scores: editingScores })
    setShowScoreModal(false)
  }

  function handleDeleteStudent(id: number) {
    if (confirm('确定要删除该学生档案吗？此操作不可撤销。')) {
      deleteStudent(id)
      setStudents(getStudents())
      setSelected(null)
    }
  }

  function addTag(studentId: number, tag: string) {
    if (!tag.trim()) return
    setTagsMap(prev => {
      const curr = prev[studentId] || []
      if (curr.includes(tag)) return prev
      return { ...prev, [studentId]: [...curr, tag] }
    })
    setTagInput('')
  }

  function removeTag(studentId: number, tag: string) {
    setTagsMap(prev => ({ ...prev, [studentId]: (prev[studentId] || []).filter(t => t !== tag) }))
  }

  const filtered = students.filter(s => {
    const matchQuery = s.name.includes(query) || s.instrument.includes(query)
    const matchFilter = filter === '全部' || s.instrument === filter
    return matchQuery && matchFilter
  })

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] flex gap-6">
      {/* 左：学生列表 */}
      <div className="w-80 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">学生档案 ({students.length})</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="搜索姓名或乐器..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['全部', ...INSTRUMENTS].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all",
                  filter === t ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                selected?.id === s.id ? "bg-indigo-50/80 ring-1 ring-indigo-100" : "hover:bg-slate-50"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm", avatarColors[idx % avatarColors.length])}>
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-slate-800 text-sm">{s.name}</span>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md font-medium", instrColors[s.instrument] || 'bg-slate-100 text-slate-500')}>
                    {s.instrument}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{s.level} · {s.age}岁</span>
                  {s.status === 'pause' && <span className="text-[10px] text-amber-500 font-bold italic">PAUSE</span>}
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-slate-300" />
              </div>
              <p className="text-xs text-slate-400">未找到相关学生</p>
            </div>
          )}
        </div>
      </div>

      {/* 右：详情区 */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {selected ? (
          <>
            <div className="p-8 border-b border-slate-50 relative">
              <button 
                onClick={() => handleDeleteStudent(selected.id)}
                className="absolute top-6 right-8 p-2 text-slate-300 hover:text-red-500 transition-colors"
                title="删除档案"
              >
                <Trash2 size={18} />
              </button>
              <div className="flex items-start gap-6">
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-indigo-100", avatarColors[students.findIndex(s => s.id === selected.id) % avatarColors.length])}>
                  {selected.avatar}
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">{selected.name}</h2>
                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold", instrColors[selected.instrument] || 'bg-slate-100 text-slate-500')}>
                      {selected.instrument}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                      {selected.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-300" /> 入学: {selected.joinDate}</span>
                    <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-300" /> {selected.phone}</span>
                    <span className="flex items-center gap-1.5"><Music size={14} className="text-slate-300" /> 主授: {selected.teacher}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <Award size={13} className="text-amber-400" /> 学习进度
                  </p>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-800">{selected.progress}%</span>
                    <span className="text-[10px] text-slate-400 font-bold mb-1">距离下一级</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full" style={{ width: `${selected.progress}%` }} />
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <Calendar size={13} className="text-rose-400" /> 下次考级
                  </p>
                  <p className="text-2xl font-bold text-slate-800">{selected.nextExam}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">预计 {selected.level.includes('级') ? (parseInt(selected.level) + 1) + '级' : '下个阶段'}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center gap-2">
                  <button 
                    onClick={() => navigate(`/lesson-plan?student=${encodeURIComponent(selected.name)}&instrument=${encodeURIComponent(selected.instrument)}&level=${encodeURIComponent(selected.level)}`)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> 生成专属教案
                  </button>
                  <button 
                    onClick={() => navigate(`/communication?studentId=${selected.id}`)}
                    className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Tag size={14} /> 发送课后反馈
                  </button>
                </div>
              </div>

              {/* 能力雷达图 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8 relative group">
                <button
                  onClick={() => { setEditingScores(selected.scores!); setShowScoreModal(true) }}
                  className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="调整能力评分"
                >
                  <BarChart2 size={16} />
                </button>
                <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-500" /> 学员综合能力雷达
                </h3>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                      { subject: '音准', A: selected.scores?.intonation || 50, full: 100 },
                      { subject: '节奏', A: selected.scores?.rhythm || 50, full: 100 },
                      { subject: '表现', A: selected.scores?.expression || 50, full: 100 },
                      { subject: '识谱', A: selected.scores?.reading || 50, full: 100 },
                      { subject: '勤奋', A: selected.scores?.diligence || 50, full: 100 },
                    ]}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name={selected.name}
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.15}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-5 gap-4 mt-4 text-center">
                  {[
                    { label: '音准', val: selected.scores?.intonation },
                    { label: '节奏', val: selected.scores?.rhythm },
                    { label: '表现', val: selected.scores?.expression },
                    { label: '识谱', val: selected.scores?.reading },
                    { label: '勤奋', val: selected.scores?.diligence },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</p>
                      <p className="text-sm font-bold text-slate-700">{s.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Tag size={16} className="text-indigo-500" /> 表现标签
                  </h3>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(tagsMap[selected.id] || []).map(t => (
                        <span key={t} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold">
                          {t}
                          <button onClick={() => removeTag(selected.id, t)} className="hover:text-rose-500">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      {(tagsMap[selected.id] || []).length === 0 && (
                        <p className="text-sm text-slate-400 italic">暂无标签，请从下方选择或手动添加...</p>
                      )}
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">推荐标签</p>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_TAGS.map(t => (
                          <button
                            key={t}
                            onClick={() => addTag(selected.id, t)}
                            disabled={tagsMap[selected.id]?.includes(t)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                              tagsMap[selected.id]?.includes(t) 
                                ? "bg-slate-50 text-slate-300 cursor-not-allowed" 
                                : "bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="自定义标签..."
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addTag(selected.id, tagInput)}
                          className="flex-1 px-4 py-2 bg-slate-50 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <button 
                          onClick={() => addTag(selected.id, tagInput)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                        >
                          添加
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
              <Users size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">选择一个学生查看详情</h3>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              从左侧列表中点击学生，可以查看详细的档案、学习进度，并为他生成专属教案或发送课后评价。
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <UserPlus size={18} /> 新录入学生
            </button>
          </div>
        )}
      </div>

      {/* 新增学生弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">新录入学生档案</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">学生姓名</label>
                <input 
                  type="text" 
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="请输入姓名"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">教学科目</label>
                  <select 
                    value={newStudent.instrument}
                    onChange={e => setNewStudent({...newStudent, instrument: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none appearance-none"
                  >
                    {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">当前级别</label>
                  <select 
                    value={newStudent.level}
                    onChange={e => setNewStudent({...newStudent, level: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none appearance-none"
                  >
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">年龄</label>
                  <input 
                    type="number" 
                    value={newStudent.age}
                    onChange={e => setNewStudent({...newStudent, age: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">主讲老师</label>
                  <input 
                    type="text" 
                    value={newStudent.teacher}
                    onChange={e => setNewStudent({...newStudent, teacher: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">联系电话</label>
                <input 
                  type="text" 
                  value={newStudent.phone}
                  onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                  placeholder="家长联系方式"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleAddStudent}
                disabled={!newStudent.name || !newStudent.phone}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={18} /> 确认录入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 评分调整弹窗 */}
      {showScoreModal && editingScores && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-slate-800">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold">调整能力评分</h3>
              <button onClick={() => setShowScoreModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-5">
              {[
                { label: '音准 (Intonation)', key: 'intonation' },
                { label: '节奏 (Rhythm)', key: 'rhythm' },
                { label: '表现力 (Expression)', key: 'expression' },
                { label: '识谱 (Reading)', key: 'reading' },
                { label: '勤奋度 (Diligence)', key: 'diligence' },
              ].map(item => (
                <div key={item.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500">{item.label}</label>
                    <span className="text-xs font-bold text-indigo-600">{(editingScores as any)[item.key]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(editingScores as any)[item.key]}
                    onChange={e => setEditingScores({ ...editingScores, [item.key]: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              ))}
            </div>
            <div className="px-8 py-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowScoreModal(false)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm"
              >
                取消
              </button>
              <button 
                onClick={handleUpdateScores}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-sm"
              >
                保存评分
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
