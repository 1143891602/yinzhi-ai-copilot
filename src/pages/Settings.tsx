import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Cpu,
  Download,
  ExternalLink,
  Key,
  Link,
  Loader2,
  ShieldCheck,
  UploadCloud,
  Wifi,
  XCircle,
} from 'lucide-react'
import { getApiConfig, saveApiConfig, testApiConnection } from '@/lib/ai'

const presets = [
  {
    name: '本地代理',
    url: 'http://localhost:3001/v1',
    description: '推荐开发环境使用，前端通过本地代理转发请求。',
    badge: 'Recommended',
  },
  {
    name: '官方 OpenAI 风格接口',
    url: 'https://api.openai.com/v1',
    description: '适合直接接入标准兼容接口，请确认浏览器端跨域与安全策略。',
    badge: 'Standard',
  },
  {
    name: '自定义服务',
    url: '',
    description: '保留给机构自建网关或第三方模型代理服务。',
    badge: 'Custom',
  },
]

export default function Settings() {
  const [baseUrl, setBaseUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-5.4')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const config = getApiConfig()
    setBaseUrl(config.baseUrl)
    setApiKey(config.apiKey)
    setModel(config.model)
  }, [])

  const maskedKey = useMemo(() => {
    if (!apiKey) return '未填写 API Key'
    if (apiKey.length <= 10) return apiKey
    return `${apiKey.slice(0, 4)}••••${apiKey.slice(-4)}`
  }, [apiKey])

  async function handleSave() {
    if (!baseUrl.trim() || !apiKey.trim() || !model.trim()) {
      setStatus('error')
      setMessage('请完整填写 Base URL、API Key 与模型名称。')
      return
    }

    setSaving(true)
    try {
      saveApiConfig({
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim(),
        model: model.trim(),
      })
      setStatus('success')
      setMessage('配置已保存到本地浏览器。')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage('保存失败，请稍后重试。')
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    if (!baseUrl.trim() || !apiKey.trim() || !model.trim()) {
      setStatus('error')
      setMessage('请先填写完整配置，再执行连接测试。')
      return
    }

    setTesting(true)
    setMessage('正在测试模型连接...')
    setStatus('idle')

    try {
      const result = await testApiConnection({
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim(),
        model: model.trim(),
      })

      setStatus(result.ok ? 'success' : 'error')
      setMessage(result.message)
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage('连接测试失败，请确认网络、代理地址和密钥是否正确。')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="relative mx-auto max-w-5xl space-y-8 px-4 pb-20 pt-4 lg:px-6">
      <div className="ambient-glow left-[-40px] top-[20%] h-[180px] w-[180px] bg-premium-purple/12 animate-breathe-slow" />
      <div className="ambient-glow right-[4%] top-[12%] h-[240px] w-[240px] bg-sky-300/15 animate-float-slow" />

      <section className="premium-glass relative overflow-hidden px-8 py-9 lg:px-10 lg:py-11">
        <div className="absolute inset-y-0 right-0 w-[34%] bg-gradient-to-l from-sky-100/60 via-transparent to-transparent" />
        <div className="absolute right-[-18px] top-4 h-40 w-40 rounded-full bg-premium-purple/12 blur-3xl animate-drift" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-4">
              <div className="secondary-glass flex h-14 w-14 items-center justify-center rounded-[24px] bg-white/80">
                <ShieldCheck className="text-premium-purple" size={22} />
              </div>
              <div>
                <p className="mono-label">Connection / local configuration</p>
                <h1 className="hero-text mt-3 text-[clamp(2.4rem,5.6vw,4.4rem)]">
                  配置中心，<br />
                  <strong>也保持安静、清晰、可信赖。</strong>
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-[16px] leading-8 text-slate-500">
              这里管理 AI 接口连接信息。配置会保存在当前浏览器本地，不会上送仓库；你可以快速切换代理地址、模型名，并做一次即时连通性测试。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: '当前模型', value: model || '未设置' },
              { label: '接口地址', value: baseUrl || '未设置' },
              { label: '密钥状态', value: apiKey ? '已填写' : '待填写' },
            ].map((item) => (
              <div key={item.label} className="secondary-glass rounded-[24px] bg-white/72 px-4 py-4">
                <p className="mono-label text-slate-400">{item.label}</p>
                <p className="mt-3 line-clamp-2 text-sm font-black leading-6 text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="premium-glass xl:col-span-7 p-7 lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="section-title text-[1.55rem]">
                接口<span className="font-black">配置.</span>
              </h2>
              <p className="mono-label mt-2 text-slate-400">Saved to local browser storage</p>
            </div>
            <div className="secondary-glass flex h-11 w-11 items-center justify-center rounded-[18px] bg-white/76">
              <Key size={18} className="text-premium-purple" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="mono-label">Base URL</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(event) => setBaseUrl(event.target.value)}
                placeholder="http://localhost:3001/v1"
                className="w-full rounded-[22px] border border-slate-200 bg-white/78 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
              />
            </div>

            <div className="space-y-2">
              <label className="mono-label">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="sk-..."
                className="w-full rounded-[22px] border border-slate-200 bg-white/78 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
              />
              <p className="text-xs text-slate-400">当前显示：{maskedKey}</p>
            </div>

            <div className="space-y-2">
              <label className="mono-label">模型名称</label>
              <input
                type="text"
                value={model}
                onChange={(event) => setModel(event.target.value)}
                placeholder="gpt-5.4"
                className="w-full rounded-[22px] border border-slate-200 bg-white/78 px-5 py-4 text-sm text-slate-800 outline-none transition-all focus:border-premium-purple/30 focus:ring-4 focus:ring-premium-purple/10"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => preset.url && setBaseUrl(preset.url)}
                className={`secondary-glass rounded-[24px] border px-4 py-4 text-left transition-all ${
                  baseUrl === preset.url && preset.url
                    ? 'border-premium-purple/25 bg-premium-purple/6'
                    : 'border-transparent bg-white/68 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black text-slate-900">{preset.name}</p>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-slate-500">
                    {preset.badge}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-500">{preset.description}</p>
                {preset.url && <p className="mt-3 text-[11px] text-slate-400">{preset.url}</p>}
              </button>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleSave} disabled={saving} className="apple-btn justify-center">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {saving ? '保存中...' : '保存配置'}
            </button>
            <button onClick={handleTest} disabled={testing} className="ghost-btn justify-center">
              {testing ? <Loader2 size={16} className="animate-spin" /> : <Wifi size={16} />}
              {testing ? '测试中...' : '测试连接'}
            </button>
          </div>
        </section>

        <div className="xl:col-span-5 space-y-6">
          <section className="premium-glass p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="section-title text-[1.45rem]">
                  状态<span className="font-black">反馈.</span>
                </h2>
                <p className="mono-label mt-2 text-slate-400">Connectivity signal</p>
              </div>
              <div className="secondary-glass flex h-11 w-11 items-center justify-center rounded-[18px] bg-white/76">
                {status === 'success' ? (
                  <CheckCircle size={18} className="text-emerald-500" />
                ) : status === 'error' ? (
                  <XCircle size={18} className="text-rose-500" />
                ) : (
                  <Link size={18} className="text-slate-400" />
                )}
              </div>
            </div>

            <div
              className={`mt-6 rounded-[24px] border px-5 py-5 ${
                status === 'success'
                  ? 'border-emerald-200 bg-emerald-50/80'
                  : status === 'error'
                    ? 'border-rose-200 bg-rose-50/80'
                    : 'border-slate-200 bg-white/70'
              }`}
            >
              <div className="flex items-center gap-3">
                {status === 'success' ? (
                  <CheckCircle size={18} className="text-emerald-500" />
                ) : status === 'error' ? (
                  <AlertTriangle size={18} className="text-rose-500" />
                ) : (
                  <Cpu size={18} className="text-slate-400" />
                )}
                <p className="text-sm font-semibold text-slate-700">
                  {message || '保存后可立即进行连接测试。'}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                {
                  icon: ShieldCheck,
                  title: '本地保存',
                  text: '配置写入浏览器 localStorage，不进入代码仓库。',
                },
                {
                  icon: UploadCloud,
                  title: '快速切换',
                  text: '可为不同代理或模型快速替换地址与名称。',
                },
              ].map((card) => (
                <div key={card.title} className="secondary-glass rounded-[22px] bg-white/70 px-4 py-4">
                  <card.icon size={18} className="text-premium-purple" />
                  <p className="mt-4 text-sm font-black text-slate-900">{card.title}</p>
                  <p className="mt-2 text-xs leading-6 text-slate-500">{card.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="premium-glass p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="section-title text-[1.45rem]">
                  使用<span className="font-black">提示.</span>
                </h2>
                <p className="mono-label mt-2 text-slate-400">Safe setup checklist</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">V2.0 安全增强</span>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <div className="secondary-glass rounded-[22px] bg-white/70 px-4 py-4">
                <p className="font-semibold text-slate-800">1. 本地代理优先</p>
                <p className="mt-1 text-slate-500">
                  开发环境建议优先使用 `http://localhost:3001/v1`，减少浏览器跨域限制和直连暴露风险。
                </p>
              </div>
              <div className="secondary-glass rounded-[22px] bg-white/70 px-4 py-4">
                <p className="font-semibold text-slate-800">2. 避免把 Key 写进代码</p>
                <p className="mt-1 text-slate-500">
                  请只在此页面输入或替换 API Key，不要把密钥硬编码到源码或截图外发。
                </p>
              </div>
              <div className="secondary-glass rounded-[22px] bg-white/70 px-4 py-4">
                <p className="font-semibold text-slate-800">3. 测试连接看返回</p>
                <p className="mt-1 text-slate-500">
                  如果测试失败，优先排查代理服务是否启动、模型名是否正确，以及目标接口是否兼容流式输出。
                </p>
              </div>
            </div>

            <a
              href="https://platform.openai.com/docs/api-reference"
              target="_blank"
              rel="noreferrer"
              className="ghost-btn mt-6 inline-flex"
            >
              <ExternalLink size={16} />
              查看兼容接口说明
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
