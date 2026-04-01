import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Library,
  Search,
  BookOpen,
  Database,
  CloudUpload,
  Activity,
} from 'lucide-react'
import {
  getKnowledgeSnippets,
  addKnowledgeSnippet,
  deleteKnowledgeSnippet,
  type KnowledgeSnippet,
} from '@/lib/knowledgeStorage'

const CATEGORIES = ['教学法', '曲目分析', '考级大纲', '音乐理论', '其他']

export default function TeachingResearch() {
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeSnippet[]>([])
  const [newContent, setNewContent] = useState('')
  const [category, setCategory] = useState('教学法')
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    setKnowledgeList(getKnowledgeSnippets())
  }, [])

  const handleAdd = () => {
    if (!newContent) return
    addKnowledgeSnippet({ content: newContent, category, title: '未命名', enabled: true })
    setKnowledgeList(getKnowledgeSnippets())
    setNewContent('')
  }

  const handleDelete = (id: string) => {
    deleteKnowledgeSnippet(id)
    setKnowledgeList(getKnowledgeSnippets())
  }

  const handleFileUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      alert('模拟：文件已解析并存入知识库')
    }, 2000)
  }

  const filteredList = knowledgeList.filter(
    (k) =>
      k.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-20 pt-4 lg:px-6">
      <section className="premium-glass relative overflow-hidden px-8 py-10 lg:px-10">
        <div className="absolute left-[8%] top-8 h-24 w-24 rounded-full bg-premium-purple/14 blur-3xl animate-breathe-slow" />
        <div className="absolute right-[10%] top-8 h-20 w-20 rounded-full bg-sky-300/20 blur-3xl animate-float-slow" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="secondary-glass flex h-14 w-14 items-center justify-center rounded-[22px] bg-white/80 text-premium-purple">
            <Library size={22} />
          </div>
          <div>
            <p className="mono-label text-slate-400">Knowledge matrix</p>
            <h1 className="section-title text-[2.6rem]">
              教研<span className="font-black">矩阵.</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6">
          <div className="premium-glass p-8">
            <div className="space-y-8">
              <div>
                <p className="mono-label mb-4 text-slate-400">知识分类 / Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-all duration-300 ${
                        category === c
                          ? 'bg-premium-purple text-white shadow-glow'
                          : 'border border-white/90 bg-white/70 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mono-label mb-4 text-slate-400">知识片段 / Content</p>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="在此注入教学经验、重点难点解析..."
                  className="min-h-[180px] w-full rounded-[28px] border border-white/90 bg-white/75 p-5 text-[14px] leading-7 text-slate-700 outline-none transition-all resize-none focus:border-premium-purple/35 focus:shadow-[0_14px_32px_rgba(110,44,242,0.10)]"
                />
              </div>
            </div>

            <button onClick={handleAdd} disabled={!newContent} className="apple-btn mt-8 w-full">
              <Plus size={18} strokeWidth={2.8} /> 注入知识核心
            </button>
          </div>

          <div className="premium-glass p-8">
            <div className="mb-6">
              <h3 className="section-title text-[1.6rem]">批量导入.</h3>
              <p className="mono-label mt-2 text-slate-400">External intelligence import</p>
            </div>
            <button
              onClick={handleFileUpload}
              className="secondary-glass flex w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200/90 bg-white/65 px-6 py-10 text-center transition-all hover:bg-white/82"
            >
              {isUploading ? (
                <>
                  <div className="h-10 w-10 rounded-full border-2 border-premium-purple/25 border-t-premium-purple animate-spin" />
                  <span className="mono-label mt-4 text-premium-purple">Parsing intelligence...</span>
                </>
              ) : (
                <>
                  <div className="secondary-glass flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/76 text-slate-500">
                    <CloudUpload size={28} />
                  </div>
                  <p className="mt-5 text-[14px] font-semibold text-slate-700">点击或拖拽上传</p>
                  <p className="mono-label mt-2 text-slate-400">Supports PDF, DOCX, TXT</p>
                </>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8 space-y-6">
          <div className="premium-glass flex items-center gap-4 px-6 py-5">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="搜索教研核心知识..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
            />
            <div className="secondary-glass flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              <Database size={12} />
              {knowledgeList.length} units
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredList.map((k) => (
                <motion.div
                  key={k.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="premium-glass group flex h-[320px] flex-col justify-between p-8 transition-shadow hover:shadow-[0_24px_48px_rgba(110,44,242,0.12)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="secondary-glass rounded-full bg-white/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-premium-purple shadow-sm">
                      {k.category}
                    </div>
                    <button 
                      onClick={() => handleDelete(k.id)} 
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 -m-2 text-slate-300 hover:text-rose-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p className="mt-6 line-clamp-6 text-[15px] leading-8 text-slate-600 font-medium">
                    {k.content}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Activity size={14} className="text-premium-purple" />
                      <span className="mono-label text-slate-400">Intelligence unit active</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{new Date(k.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredList.length === 0 && (
            <div className="premium-glass flex h-[420px] flex-col items-center justify-center text-slate-300">
              <div className="secondary-glass flex h-24 w-24 items-center justify-center rounded-[30px] bg-white/72">
                <BookOpen size={36} strokeWidth={1.4} />
              </div>
              <p className="mono-label mt-8 text-slate-400">等待教研核心知识注入...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
