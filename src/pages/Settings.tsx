import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2, Wifi, Key, Link, Cpu, AlertTriangle, ExternalLink, Download, UploadCloud, ShieldCheck } from 'lucide-react'
import { getApiConfig, saveApiConfig, testApiConnection, type ApiConfig } from '@/lib/ai'
import { cn } from '@/lib/utils'

type TestStatus = 'idle' | 'testing' | 'ok' | 'fail'

const PRESET_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'deepseek-chat', 'claude-3-5-sonnet-20241022']

const CORS_APIS = [
  { name: 'OpenAI 官方', url: 'https://api.openai.com/v1', note: '需要 OpenAI API Key' },
  { name: 'DeepSeek', url: 'https://api.deepseek.com/v1', note: '国内可访问，价格低' },
  { name: 'Moonshot（月之暗面）', url: 'https://api.moonshot.cn/v1', note: 'Kimi 背后的模型' },
  { name: 'ZhipuAI（智谱）', url: 'https://open.bigmodel.cn/api/paas/v4', note: 'GLM 系列模型' },
]

export default function Settings() {
  const [config, setConfig] = useState<ApiConfig>({ baseUrl: '', apiKey: '', model: 'gpt-4o' })
  const [status, setStatus] = useState<TestStatus>('idle')
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const c = getApiConfig()
    if (c.baseUrl || c.apiKey) setConfig(c)
  }, [])

  async function handleTest() {
    if (!config.baseUrl || !config.apiKey) {
      setStatus('fail')
      setMessage('请先填写 API URL 和 API Key')
      return
    }
    setStatus('testing')
    setMessage('')
    const result = await testApiConnection(config)
    setStatus(result.ok ? 'ok' : 'fail')
    setMessage(result.message)
    if (result.ok) {
      saveApiConfig(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  function handleSaveWithoutTest() {
    saveApiConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleExportData() {
    const data = {
      yinzhi_api_config: localStorage.getItem('yinzhi_api_config'),
      yinzhi_lessons: localStorage.getItem('yinzhi_lessons'),
      yinzhi_students: localStorage.getItem('yinzhi_students'),
      yinzhi_student_tags: localStorage.getItem('yinzhi_student_tags'),
      yinzhi_knowledge: localStorage.getItem('yinzhi_knowledge'),
      exportDate: new Date().toISOString(),
      version: '2.0.0'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `音智AI_数据备份_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!confirm('导入数据将覆盖当前所有教案、学生和设置，确定继续吗？')) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.yinzhi_api_config) localStorage.setItem('yinzhi_api_config', data.yinzhi_api_config)
        if (data.yinzhi_lessons) localStorage.setItem('yinzhi_lessons', data.yinzhi_lessons)
        if (data.yinzhi_students) localStorage.setItem('yinzhi_students', data.yinzhi_students)
        if (data.yinzhi_student_tags) localStorage.setItem('yinzhi_student_tags', data.yinzhi_student_tags)
        if (data.yinzhi_knowledge) localStorage.setItem('yinzhi_knowledge', data.yinzhi_knowledge)
        alert('数据导入成功！页面即将刷新以加载新数据。')
        window.location.reload()
      } catch (err) {
        alert('导入失败：文件格式不正确')
      }
    }
    reader.readAsText(file)
  }

  const isConfigured = status === 'ok'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold text-indigo-500 mb-1 tracking-widest uppercase">Settings</p>
        <h1 className="text-2xl font-bold text-slate-900">系统设置</h1>
        <p className="mt-1 text-slate-500 text-sm">配置您自己的 AI 大模型 API，连接成功后即可使用全部 AI 功能。</p>
      </div>

      {/* 未配置提示 */}
      {status !== 'ok' && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-700">
            <span className="font-bold">AI 功能尚未激活。</span> 请填写下方 API 配置并点击「测试连接」，通过后所有 AI 功能将自动解锁。
          </div>
        </div>
      )}

      {/* API 配置卡片 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Key size={15} className="text-indigo-500" /> API 配置
        </h2>

        {/* API Base URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Link size={11} /> API Base URL
          </label>
          <input
            value={config.baseUrl}
            onChange={e => { setConfig(c => ({ ...c, baseUrl: e.target.value })); setStatus('idle') }}
            placeholder="https://api.openai.com/v1"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono"
          />
        </div>

        {/* API Key */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Key size={11} /> API Key
          </label>
          <input
            type="password"
            value={config.apiKey}
            onChange={e => { setConfig(c => ({ ...c, apiKey: e.target.value })); setStatus('idle') }}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono"
          />
        </div>

        {/* 模型名称 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Cpu size={11} /> 模型名称
          </label>
          <div className="flex gap-2">
            <input
              value={config.model}
              onChange={e => setConfig(c => ({ ...c, model: e.target.value }))}
              placeholder="gpt-4o"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_MODELS.map(m => (
              <button
                key={m}
                onClick={() => setConfig(c => ({ ...c, model: m }))}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-lg border transition-all font-mono',
                  config.model === m
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 测试结果 */}
        {message && (
          <div className={cn(
            'flex items-start gap-3 p-4 rounded-xl text-sm',
            status === 'ok' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
          )}>
            {status === 'ok'
              ? <CheckCircle size={16} className="shrink-0 mt-0.5" />
              : <XCircle size={16} className="shrink-0 mt-0.5" />}
            <span>{message}</span>
          </div>
        )}

        {/* 按钮区 */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleTest}
            disabled={status === 'testing'}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
              status === 'testing'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : status === 'ok'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
            )}
          >
            {status === 'testing' && <Loader2 size={15} className="animate-spin" />}
            {status === 'ok' && <CheckCircle size={15} />}
            {status === 'idle' || status === 'fail' ? <Wifi size={15} /> : null}
            {status === 'testing' ? '测试中...' : status === 'ok' ? '已连接，重新测试' : '测试连接'}
          </button>

          {status === 'ok' && (
            <button
              onClick={handleSaveWithoutTest}
              className="px-5 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
            >
              {saved ? '已保存 ✓' : '保存配置'}
            </button>
          )}
        </div>

        {status === 'ok' && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI 功能已激活，所有功能可正常使用
          </div>
        )}
      </div>

      {/* 推荐 API 服务商 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-800 mb-1">推荐 API 服务商</h2>
        <p className="text-xs text-slate-400 mb-4">以下服务商支持从浏览器直接调用（CORS 已开放），可直接使用。</p>
        <div className="space-y-2">
          {CORS_APIS.map(api => (
            <button
              key={api.url}
              onClick={() => { setConfig(c => ({ ...c, baseUrl: api.url })); setStatus('idle') }}
              className={cn(
                'w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all',
                config.baseUrl === api.url
                  ? 'border-indigo-300 bg-indigo-50'
                  : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
              )}
            >
              <div>
                <p className="text-sm font-bold text-slate-800">{api.name}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{api.url}</p>
                <p className="text-xs text-slate-400 mt-0.5">{api.note}</p>
              </div>
              <ExternalLink size={13} className="text-slate-300 shrink-0 ml-3" />
            </button>
          ))}
        </div>
      </div>

      {/* 数据安全与备份 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck size={15} className="text-emerald-500" /> 数据管理与备份
          </h2>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">V2.0 安全增强</span>
        </div>
        <p className="text-xs text-slate-400">由于本系统完全运行在您的浏览器本地，建议定期备份数据以防浏览器清理缓存导致数据丢失。</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleExportData}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
          >
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Download size={20} />
            </div>
            <p className="text-sm font-bold text-slate-800">导出数据备份</p>
            <p className="text-[10px] text-slate-400 mt-1">下载 .json 格式备份文件</p>
          </button>

          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group cursor-pointer">
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <p className="text-sm font-bold text-slate-800">导入数据恢复</p>
            <p className="text-[10px] text-slate-400 mt-1">从备份文件还原所有数据</p>
          </label>
        </div>
      </div>

      {/* 说明 */}
      <div className="bg-slate-50 rounded-2xl p-5 text-xs text-slate-500 space-y-2 leading-relaxed">
        <p className="font-bold text-slate-600">⚠️ 关于跨域（CORS）限制</p>
        <p>本应用以单文件方式运行在浏览器中，AI 请求直接从浏览器发出。部分 API 服务（如某些中转站）禁止跨域请求，会导致连接失败。建议使用上方列出的服务商，或确认您的 API 服务已开启 CORS。</p>
        <p className="font-bold text-slate-600 pt-1">🔒 安全提示</p>
        <p>您的 API Key 仅存储在本设备浏览器的本地存储中，不会上传至任何服务器。</p>
      </div>
    </div>
  )
}
