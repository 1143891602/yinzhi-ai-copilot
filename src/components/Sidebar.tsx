import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  const location = useLocation()

  return (
    <div className="flex flex-col w-64 h-screen bg-slate-950 text-white shrink-0 relative z-40 shadow-2xl">
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600/10 blur-[100px] pointer-events-none" />
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-7 py-8 relative">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-slate-900 p-2 rounded-xl ring-1 ring-white/10 flex items-center justify-center">
            <Music4 className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">音智 AI</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500/80">Copilot V2.1</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 relative mt-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.to || (item.to === '/' && location.pathname === '/')
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden',
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                )
              }
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/20"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <item.icon className={cn("w-4.5 h-4.5 shrink-0 relative z-10", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} size={18} />
              <span className="relative z-10">{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/5 space-y-1 relative bg-slate-950/50 backdrop-blur-md">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden',
              isActive
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            )
          }
        >
          {location.pathname === '/settings' && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/20"
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
            />
          )}
          <Settings className={cn("relative z-10", location.pathname === '/settings' ? "text-white" : "text-slate-500 group-hover:text-slate-300")} size={18} />
          <span className="relative z-10">系统设置</span>
        </NavLink>

        <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 border border-white/5 mt-3 group hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center ring-1 ring-white/20">
              <GraduationCap size={16} className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate text-slate-200">特级教师 张老师</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">钢琴教研中心</p>
          </div>
        </div>
      </div>
    </div>
  )
}
