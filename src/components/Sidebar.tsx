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
    <aside className="premium-glass flex h-full w-full flex-col overflow-hidden border border-white/70 bg-white/55 shadow-soft">
      <div className="px-7 pt-8 pb-6 relative">
        <div className="absolute right-4 top-3 h-16 w-16 rounded-full bg-premium-purple/10 blur-2xl animate-breathe-slow" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[20px] border border-white/80 bg-white/75 shadow-[0_10px_28px_rgba(110,44,242,0.14)]">
            <div className="absolute inset-1 rounded-[16px] bg-gradient-to-br from-premium-purple/15 to-sky-300/20" />
            <Music4 className="relative z-10 h-5 w-5 text-slate-800" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">Intelligent Core</p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-slate-900">音智 AI</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4 no-scrollbar">
        {menu.map((item) => {
          const isActive = location.pathname === item.to || (item.to === '/' && location.pathname === '/')
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={cn(
                'relative flex items-center gap-4 overflow-hidden rounded-[22px] px-4 py-3.5 text-[13px] font-medium tracking-tight transition-all duration-300',
                isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-[22px] border border-white/80 bg-white/85 shadow-[0_14px_30px_rgba(110,44,242,0.12)]"
                  transition={{ type: 'spring', bounce: 0.12, duration: 0.5 }}
                />
              )}
              {!isActive && <div className="absolute inset-0 rounded-[22px] bg-white/0 transition-all duration-300 hover:bg-white/45" />}
              <item.icon
                className={cn(
                  'relative z-10 h-[18px] w-[18px] shrink-0 transition-colors',
                  isActive ? 'text-premium-purple' : 'text-slate-400 group-hover:text-slate-700'
                )}
                strokeWidth={isActive ? 2.5 : 2.1}
              />
              <span className="relative z-10">{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-200/80 px-4 py-5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'mb-3 flex items-center gap-4 rounded-[20px] px-4 py-3 text-[13px] font-medium tracking-tight transition-all duration-300',
              isActive
                ? 'bg-white/80 text-slate-900 shadow-[0_10px_26px_rgba(15,23,42,0.06)]'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
            )
          }
        >
          <Settings size={18} className="text-slate-500" />
          <span>系统设置</span>
        </NavLink>

        <div className="secondary-glass flex items-center gap-4 rounded-[24px] px-4 py-4 bg-white/65">
          <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-gradient-to-br from-premium-purple/15 to-sky-300/20 text-slate-700 shadow-[0_10px_24px_rgba(33,150,243,0.12)]">
            <GraduationCap size={18} strokeWidth={2.3} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-800 truncate">张老师</p>
            <p className="mono-label text-[7px] text-slate-400">Creative Faculty Pro</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

