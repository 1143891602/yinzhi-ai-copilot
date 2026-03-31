import { useState } from 'react'
import { Key, Cpu, Globe, ShieldCheck, Check } from 'lucide-react'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4o')
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">系统设置</h1>
        <p className="mt-1 text-slate-500 text-sm">配置 AI 引擎和机构信息，激活音智的全部功能。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <nav className="space-y-1">
          {[
            { icon: Cpu, label: 'AI 引擎配置', active: true },
            { icon: Globe, label: '机构基本资料', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="md:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <Key size={16} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">模型接口配置</h3>
                <p className="text-xs text-slate-500 mt-0.5">填入 API Key 即可激活 AI 教案生成与家校沟通功能。</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <ShieldCheck size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">默认模型</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none appearance-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="gpt-4o">OpenAI GPT-4o（推荐）</option>
                <option value="gpt-4-turbo">OpenAI GPT-4 Turbo</option>
                <option value="deepseek-chat">DeepSeek-V3（高性价比）</option>
                <option value="deepseek-reasoner">DeepSeek-R1（推理增强）</option>
              </select>
            </div>

            <button
              onClick={save}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              {saved ? <><Check size={15} /> 已保存</> : '保存配置'}
            </button>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 text-white flex items-start gap-4">
            <div className="text-2xl">🎹</div>
            <div>
              <h4 className="font-bold">正在使用音智免费版</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">升级至机构专业版可获得：私有化模型微调、无限量教案生成、多校区统一管理。</p>
              <button className="mt-3 text-xs font-bold bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-400 transition-colors">
                立即升级
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
