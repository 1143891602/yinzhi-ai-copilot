import { Search, Bell, User, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <header className="premium-glass flex items-center justify-between gap-6 rounded-[30px] border-white/80 bg-white/58 px-8 py-5 shadow-soft">
      <div className="relative flex-1 max-w-2xl group">
        <div className="secondary-glass absolute inset-0 rounded-[24px] border-white/80 bg-white/68 transition-all duration-300 group-focus-within:shadow-[0_16px_32px_rgba(110,44,242,0.10)]" />
        <div className="relative flex h-14 items-center">
          <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-premium-purple" />
          <input
            type="text"
            placeholder="搜索教案、知识库、学员档案..."
            className="h-full w-full bg-transparent pl-14 pr-24 text-[14px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
          <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:block">
            Cmd K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="secondary-glass hidden items-center gap-3 rounded-full border-white/75 bg-white/72 px-4 py-2.5 lg:flex">
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-premium-purple/10 text-premium-purple">
            <Sparkles size={12} />
            <span className="absolute inset-0 rounded-full bg-premium-purple/20 animate-ping opacity-35" />
          </div>
          <span className="mono-label text-[8px] text-slate-500">智能教研核心已就绪</span>
        </div>

        <motion.button
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="secondary-glass relative flex h-12 w-12 items-center justify-center rounded-[20px] border-white/80 bg-white/70 text-slate-500 hover:text-slate-900"
        >
          <Bell size={18} />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-premium-purple shadow-[0_0_12px_rgba(110,44,242,0.55)]" />
        </motion.button>

        <div className="h-9 w-px bg-slate-200/90" />

        <div className="flex items-center gap-3 rounded-full px-1 py-1 transition-all duration-300 hover:bg-white/40">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-semibold text-slate-800">音智教研组</p>
            <p className="mono-label text-[8px] text-slate-400">Enterprise Premium</p>
          </div>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[20px] bg-gradient-to-br from-white to-slate-100 text-slate-500 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-0 rounded-[20px] border border-white/85" />
            <User size={18} className="relative z-10" />
          </div>
        </div>
      </div>
    </header>
  )
}
