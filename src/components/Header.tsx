import { Search, Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="flex items-center justify-between h-14 px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md shrink-0 sticky top-0 z-10">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="搜索教案、知识库..."
          className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <span className="text-sm font-semibold text-slate-600">音智 AI 教研中心</span>
      </div>
    </header>
  )
}
