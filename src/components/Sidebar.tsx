import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Library,
  MessageSquare,
  Settings,
  Music4,
  GraduationCap,
  Users,
  BookOpen,
  FolderOpen,
} from 'lucide-react'

const menu = [
  { name: '概览', icon: LayoutDashboard, to: '/' },
  { name: '教案生成', icon: FileText, to: '/lesson-plan' },
  { name: '我的教案库', icon: FolderOpen, to: '/my-lessons' },
  { name: '大课包生成', icon: BookOpen, to: '/course-package' },
  { name: '教研体系', icon: Library, to: '/teaching-research' },
  { name: '家校沟通', icon: MessageSquare, to: '/communication' },
  { name: '学生管理', icon: Users, to: '/students' },
]

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 h-screen bg-slate-950 text-white shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-7">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Music4 className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">音智 AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )
            }
          >
            <item.icon className="w-4.5 h-4.5 shrink-0" size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )
          }
        >
          <Settings size={18} />
          系统设置
        </NavLink>

        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-900 border border-slate-800 mt-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
            <GraduationCap size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">特级教师 张老师</p>
            <p className="text-xs text-slate-500 truncate">钢琴教学中心</p>
          </div>
        </div>
      </div>
    </div>
  )
}
