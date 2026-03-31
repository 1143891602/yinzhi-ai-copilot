import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Upload, Trash2, Search, CheckCircle2, Clock, BookOpen, AlertTriangle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type Doc = { id: number; name: string; type: string; size: string; status: 'ready' | 'processing'; date: string }

const initialDocs: Doc[] = [
  { id: 1, name: '音智钢琴初级教学大纲.pdf', type: 'PDF', size: '2.4 MB', status: 'ready', date: '2024-03-20' },
  { id: 2, name: '声乐呼吸训练法（内部教材）.docx', type: 'DOCX', size: '1.1 MB', status: 'ready', date: '2024-03-15' },
  { id: 3, name: '2024 春季考级考前辅导指南.pdf', type: 'PDF', size: '4.8 MB', status: 'processing', date: '2024-03-28' },
  { id: 4, name: '乐理基础：五线谱入门讲义.pdf', type: 'PDF', size: '0.9 MB', status: 'ready', date: '2024-02-10' },
]

export default function TeachingResearch() {
  const [docs, setDocs] = useState<Doc[]>(initialDocs)
  const [uploading, setUploading] = useState(false)
  const [query, setQuery] = useState('')

  const onDrop = useCallback((files: File[]) => {
    setUploading(true)
    setTimeout(() => {
      const newDocs: Doc[] = files.map((f, i) => ({
        id: Date.now() + i,
        name: f.name,
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
        status: 'processing',
        date: new Date().toISOString().split('T')[0],
      }))
      setDocs((prev) => [...newDocs, ...prev])
      setUploading(false)
      // simulate vectorizing done
      setTimeout(() => {
        setDocs((prev) =>
          prev.map((d) => (newDocs.find((n) => n.id === d.id) ? { ...d, status: 'ready' } : d))
        )
      }, 3000)
    }, 1200)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
  })

  const remove = (id: number) => setDocs((prev) => prev.filter((d) => d.id !== id))
  const filtered = docs.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">教研体系管理</h1>
        <p className="mt-1 text-slate-500 text-sm">上传教研资料，AI 自动向量化建立知识库，用于教案生成时的精准检索。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧统计 */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen size={15} className="text-indigo-600" /> 知识库统计
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">文档总数</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{docs.length}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">向量节点</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">1.2k</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                <p className="text-xs text-slate-500 mb-1">就绪率</p>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(docs.filter(d=>d.status==='ready').length/docs.length)*100}%` }} />
                </div>
                <p className="text-xs text-slate-600 font-semibold mt-1.5">
                  {docs.filter(d=>d.status==='ready').length}/{docs.length} 文档已就绪
                </p>
              </div>
            </div>
          </div>

          {/* 知识库健康度 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={15} className="text-emerald-500" /> 知识库健康度
            </h3>
            {[
              { name: '钢琴教研库', score: 85, files: 2, warn: false },
              { name: '声乐教研库', score: 60, files: 1, warn: true },
              { name: '乐理库', score: 40, files: 1, warn: true },
            ].map(lib => (
              <div key={lib.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">{lib.name}</span>
                  <div className="flex items-center gap-1.5">
                    {lib.warn && <AlertTriangle size={11} className="text-amber-400" />}
                    <span className={`text-xs font-bold ${lib.score >= 80 ? 'text-emerald-600' : lib.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                      {lib.score}分
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${lib.score >= 80 ? 'bg-emerald-500' : lib.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${lib.score}%` }}
                  />
                </div>
                {lib.warn && (
                  <p className="text-xs text-amber-500 mt-1">建议补充更多资料以提升质量</p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-indigo-600 rounded-2xl p-5 text-white">
            <p className="text-xs font-bold text-indigo-200 mb-2">RAG 智能检索</p>
            <p className="text-sm leading-relaxed text-indigo-100">
              AI 生成教案时会精准检索您的知识库，确保教学风格与机构标准 100% 一致。
            </p>
          </div>
        </div>

        {/* 右侧主体 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 上传区 */}
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer',
              isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
            )}
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <Upload size={20} className="text-indigo-600" />
            </div>
            <p className="text-sm font-bold text-slate-700">
              {isDragActive ? '松开即可上传' : '点击或拖拽文件到此处上传'}
            </p>
            <p className="text-xs text-slate-400 mt-1">支持 PDF、DOCX（最大 50 MB）</p>
            {uploading && (
              <p className="text-xs text-indigo-600 font-semibold mt-3 flex items-center gap-1.5">
                <Clock size={12} className="animate-spin" /> 正在解析并建立向量索引...
              </p>
            )}
          </div>

          {/* 文件列表 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">我的教研资料</h3>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索文档..."
                  className="pl-8 pr-3 py-1.5 bg-slate-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {filtered.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.type} · {doc.size} · {doc.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.status === 'processing' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        <Clock size={11} className="animate-spin" /> 向量化中
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={11} /> 已就绪
                      </span>
                    )}
                    <button
                      onClick={() => remove(doc.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
