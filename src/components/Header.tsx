import { Search, Bell, Sparkles, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <header className="flex items-center justify-between h-20 px-10 border-b border-slate-200/50 bg-white/60 backdrop-blur-xl shrink-0 sticky top-0 z-30">
      <div className="relative flex-1 max-w-md group">
        <div className="absolute inset-0 bg-indigo-500/5 blur-2xl group-focus-within:bg-indigo-500/10 transition-all duration-500 rounded-full" />
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="搜索教案、知识库、学员档案..."
            className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/50 border border-slate-200/50 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200/50">
            Cmd K
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-xl border border-indigo-100">
          <Sparkles size={14} className="text-indigo-500 animate-pulse" />
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">AI Agent Online</span>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-2xl text-slate-400 bg-white border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-4 ring-white" />
          </motion.button>
          
          <div className="h-6 w-px bg-slate-200 mx-1" />
          
          <div className="flex items-center gap-3 pl-1">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800 leading-tight">音智教研组</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise V2.1</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
              YZ
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
