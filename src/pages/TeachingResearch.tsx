import { useState, useEffect } from 'react'
import { FileText, Plus, Trash2, Search, CheckCircle2, BookOpen, AlertTriangle, TrendingUp, X, Sparkles, Filter, ToggleLeft, ToggleRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getKnowledgeSnippets, deleteKnowledgeSnippet, toggleKnowledgeSnippet, addKnowledgeSnippet, type KnowledgeSnippet } from '@/lib/knowledgeStorage'

export default function TeachingResearch() {
  const [snippets, setSnippets] = useState<KnowledgeSnippet[]>([])
  const [query, setQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSnippet, setNewSnippet] = useState<Partial<KnowledgeSnippet>>({
    title: '', content: '', category: '钢琴技巧', enabled: true
  })

  useEffect(() => {
    setSnippets(getKnowledgeSnippets())
  }, [])

  function handleAdd() {
    if (!newSnippet.title || !newSnippet.content) return
    addKnowledgeSnippet({
      title: newSnippet.title!,
      content: newSnippet.content!,
      category: newSnippet.category!,
      enabled: true
    })
    setSnippets(getKnowledgeSnippets())
    setShowAddModal(false)
    setNewSnippet({ title: '', content: '', category: '钢琴技巧', enabled: true })
  }

  function handleToggle(id: string) {
    toggleKnowledgeSnippet(id)
    setSnippets(getKnowledgeSnippets())
  }

  function handleDelete(id: string) {
    if (confirm('确定要删除这条教研知识吗？')) {
      deleteKnowledgeSnippet(id)
      setSnippets(getKnowledgeSnippets())
    }
  }

  const filtered = snippets.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) || 
    s.content.toLowerCase().includes(query.toLowerCase())
  )

  const categories = Array.from(new Set(snippets.map(s => s.category)))

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">教研体系管理 (RAG 知识库)</h1>
          <p className="mt-1 text-slate-500 text-sm">录入机构私有教学标准与技巧，AI 在生成教案时将自动检索并融入这些内容。</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={18} /> 录入新知识
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* 左侧：统计与分类 */}
        <div className="w-80 space-y-4 overflow-y-auto pb-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600" /> 知识库概览
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">生效中</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{snippets.filter(s=>s.enabled).length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">分类数</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{categories.length}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">知识库健康度</p>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-700">钢琴教研库</span>
                  <span className="text-xs font-bold text-emerald-700">85分</span>
                </div>
                <div className="h-1.5 bg-emerald-200/50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]" />
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-700">声乐教研库</span>
                  <span className="text-xs font-bold text-amber-700">60分</span>
                </div>
                <div className="h-1.5 bg-amber-200/50 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[60%]" />
                </div>
                <p className="text-[10px] text-amber-600 mt-2">建议继续补充教学技巧片段</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300">RAG 智能检索原理</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              当您生成教案时，AI 会计算课题与此处知识库的语义相关性，并自动提取生效中的片段作为上下文，确保生成内容符合您的机构教学标准。
            </p>
          </div>
        </div>

        {/* 右侧：列表与搜索 */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索知识标题或内容关键词..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filtered.map(s => (
              <div key={s.id} className={cn(
                "group p-6 rounded-3xl border transition-all relative overflow-hidden",
                s.enabled ? "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-100" : "bg-slate-50 border-transparent opacity-60"
              )}>
                {!s.enabled && <div className="absolute inset-0 bg-slate-100/20 pointer-events-none" />}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.enabled ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-400")}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{s.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{s.category} · {new Date(s.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(s.id)}
                      className={cn("p-2 rounded-xl transition-all", s.enabled ? "text-emerald-500 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-200")}
                      title={s.enabled ? "已启用，AI 将检索此内容" : "已禁用"}
                    >
                      {s.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-4">
                  <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">“{s.content}”</p>
                </div>
              </div>
            ))}
            
            {filtered.length === 0 && (
              <div className="py-20 text-center opacity-40">
                <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-sm font-medium text-slate-400">未找到相关教研知识</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 录入新知识弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-slate-800">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold">录入机构教研知识</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">知识标题</label>
                <input 
                  type="text" 
                  value={newSnippet.title}
                  onChange={e => setNewSnippet({...newSnippet, title: e.target.value})}
                  placeholder="如：钢琴考级技巧、小提琴运弓标准..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">知识分类</label>
                <select 
                  value={newSnippet.category}
                  onChange={e => setNewSnippet({...newSnippet, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none appearance-none"
                >
                  <option value="钢琴技巧">钢琴技巧</option>
                  <option value="声乐基础">声乐基础</option>
                  <option value="乐理教学">乐理教学</option>
                  <option value="通用教研">通用教研</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">核心内容 (AI 将读取并学习)</label>
                <textarea 
                  rows={6}
                  value={newSnippet.content}
                  onChange={e => setNewSnippet({...newSnippet, content: e.target.value})}
                  placeholder="请输入具体的教学大纲、标准或技巧细节..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm"
              >
                取消
              </button>
              <button 
                onClick={handleAdd}
                disabled={!newSnippet.title || !newSnippet.content}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 text-sm"
              >
                确认录入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
