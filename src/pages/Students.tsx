import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, ChevronRight, Music, Award, Calendar, Phone, Tag, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const TAGS_KEY = 'yinzhi_student_tags'
function getTagsMap(): Record<number, string[]> {
  try { return JSON.parse(localStorage.getItem(TAGS_KEY) || '{}') } catch { return {} }
}
function saveTagsMap(map: Record<number, string[]>) {
  localStorage.setItem(TAGS_KEY, JSON.stringify(map))
}

const PRESET_TAGS = ['节奏感强', '音准待提升', '识谱快', '练习认真', '表演欲强', '注意力集中', '手指灵活', '乐感好']

type Student = {
  id: number
  name: string
  instrument: string
  level: string
  age: number
  phone: string
  teacher: string
  joinDate: string
  nextExam: string
  status: 'active' | 'pause'
  avatar: string
  progress: number
}

const students: Student[] = [
  { id: 1, name: '王小明', instrument: '钢琴', level: '4 级', age: 9, phone: '138****8888', teacher: '张老师', joinDate: '2023-09', nextExam: '2024-06', status: 'active', avatar: '王', progress: 72 },
  { id: 2, name: '李佳琪', instrument: '钢琴', level: '2 级', age: 7, phone: '139****6666', teacher: '李老师', joinDate: '2023-11', nextExam: '2024-06', status: 'active', avatar: '李', progress: 45 },
  { id: 3, name: '张子涵', instrument: '声乐', level: '考级班', age: 11, phone: '137****5555', teacher: '王老师', joinDate: '2022-03', nextExam: '2024-07', status: 'active', avatar: '张', progress: 88 },
  { id: 4, name: '陈思远', instrument: '古筝', level: '5 级', age: 10, phone: '135****3333', teacher: '张老师', joinDate: '2023-06', nextExam: '2024-12', status: 'active', avatar: '陈', progress: 60 },
  { id: 5, name: '刘欣怡', instrument: '小提琴', level: '初级', age: 8, phone: '136****2222', teacher: '李老师', joinDate: '2024-01', nextExam: '2025-06', status: 'pause', avatar: '刘', progress: 30 },
  { id: 6, name: '赵宇航', instrument: '钢琴', level: '8 级', age: 14, phone: '133****1111', teacher: '张老师', joinDate: '2021-09', nextExam: '2024-12', status: 'active', avatar: '赵', progress: 95 },
]

const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500']
const instrColors: Record<string, string> = {
  '钢琴': 'text-blue-600 bg-blue-50',
  '声乐': 'text-purple-600 bg-purple-50',
  '古筝': 'text-emerald-600 bg-emerald-50',
  '小提琴': 'text-orange-600 bg-orange-50',
  '吉他': 'text-pink-600 bg-pink-50',
}

export default function Students() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Student | null>(null)
  const [filter, setFilter] = useState('全部')
  const [tagsMap, setTagsMap] = useState<Record<number, string[]>>(getTagsMap)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => { saveTagsMap(tagsMap) }, [tagsMap])

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

  const filters = ['全部', '钢琴', '声乐', '古筝', '小提琴']
  const filtered = students.filter((s) => {
    const matchQuery = s.name.includes(query) || s.instrument.includes(query) || s.teacher.includes(query)
    const matchFilter = filter === '全部' || s.instrument === filter
    return matchQuery && matchFilter
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">学生管理</h1>
          <p className="mt-1 text-slate-500 text-sm">管理学生档案、学习进度与考级记录。</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus size={16} /> 新增学生
        </button>
      </div>

      <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 220px)' }}>
        {/* 左：学生列表 */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* 搜索 + 筛选 */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索学生、老师、科目..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                    filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* 表头 */}
          <div className="grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">学生</div>
            <div className="col-span-2">科目 / 级别</div>
            <div className="col-span-2">主教老师</div>
            <div className="col-span-2">下次考级</div>
            <div className="col-span-1">状态</div>
            <div className="col-span-1"></div>
          </div>

          {/* 学生卡片列表 */}
          <div className="space-y-2">
            {filtered.map((s, i) => (
              <div
                key={s.id}
                onClick={() => setSelected(s)}
                className={cn(
                  'grid grid-cols-12 gap-3 items-center p-4 bg-white rounded-2xl border cursor-pointer transition-all',
                  selected?.id === s.id
                    ? 'border-indigo-300 shadow-md ring-2 ring-indigo-500/10'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
                )}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {s.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.age} 岁 · 入学 {s.joinDate}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${instrColors[s.instrument] || 'text-slate-600 bg-slate-100'}`}>
                    <Music size={10} /> {s.instrument}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{s.level}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-700 font-medium">{s.teacher}</p>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar size={11} /> {s.nextExam}
                  </div>
                </div>
                <div className="col-span-1">
                  <span className={cn(
                    'text-xs font-bold px-2 py-1 rounded-full',
                    s.status === 'active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                  )}>
                    {s.status === 'active' ? '在读' : '暂停'}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右：学生详情 */}
        {selected ? (
          <div className="w-72 shrink-0 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <div className={`w-16 h-16 rounded-full ${avatarColors[students.findIndex(s => s.id === selected.id) % avatarColors.length]} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3`}>
                {selected.avatar}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
              <p className="text-sm text-slate-400 mt-0.5">{selected.instrument} · {selected.level}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Phone size={12} className="text-slate-400" />
                <span className="text-xs text-slate-400">{selected.phone}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">学习进度</h4>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">本阶段完成度</span>
                  <span className="font-bold text-indigo-600">{selected.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `${selected.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">主教老师</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selected.teacher}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">入学时间</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{selected.joinDate}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">考级目标</h4>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <Award size={18} className="text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{selected.instrument} {selected.level}</p>
                  <p className="text-xs text-slate-500 mt-0.5">预计考级 {selected.nextExam}</p>
                </div>
              </div>
            </div>

            {/* 表现标签 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={12} /> 表现标签
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(tagsMap[selected.id] || []).map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                    {tag}
                    <button onClick={() => removeTag(selected.id, tag)} className="hover:text-red-500 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {(tagsMap[selected.id] || []).length === 0 && (
                  <span className="text-xs text-slate-300">暂无标签</span>
                )}
              </div>
              {/* 预设标签 */}
              <div className="flex flex-wrap gap-1">
                {PRESET_TAGS.filter(t => !(tagsMap[selected.id] || []).includes(t)).slice(0, 4).map(tag => (
                  <button key={tag} onClick={() => addTag(selected.id, tag)}
                    className="text-xs px-2 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                    + {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag(selected.id, tagInput)}
                  placeholder="自定义标签..."
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button onClick={() => addTag(selected.id, tagInput)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">
                  添加
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/lesson-plan')}
                className="py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">
                生成教案
              </button>
              <button
                onClick={() => navigate('/communication')}
                className="py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
                家校沟通
              </button>
            </div>
          </div>
        ) : (
          <div className="w-72 shrink-0 bg-white rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-center p-8">
            <div>
              <div className="text-4xl mb-3">👤</div>
              <p className="text-sm font-semibold text-slate-400">点击左侧学生</p>
              <p className="text-xs text-slate-300 mt-1">查看详细档案</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
