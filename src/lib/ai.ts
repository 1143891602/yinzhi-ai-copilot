const CONFIG_KEY = 'yinzhi_api_config'

export type ApiConfig = {
  baseUrl: string
  apiKey: string
  model: string
}

export function getApiConfig(): ApiConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { baseUrl: '', apiKey: '', model: 'gpt-4o' }
}

export function saveApiConfig(config: ApiConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function isApiConfigured(): boolean {
  const c = getApiConfig()
  return !!(c.baseUrl && c.apiKey)
}

// 测试 API 连通性，返回 { ok, message }
export async function testApiConnection(config: ApiConfig): Promise<{ ok: boolean; message: string }> {
  try {
    const base = config.baseUrl.replace(/\/$/, '')
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: '你好' }],
        max_tokens: 10,
        stream: false,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, message: err?.error?.message || `HTTP ${res.status}，请检查 API Key 或 URL` }
    }

    const data = await res.json()
    const reply = data?.choices?.[0]?.message?.content || '连接成功'
    return { ok: true, message: `连接成功！模型回复：${reply}` }
  } catch (e: any) {
    if (e?.message?.includes('Failed to fetch') || e?.message?.includes('CORS')) {
      return { ok: false, message: '跨域（CORS）错误：该 API 服务不支持从浏览器直接访问，请换一个支持 CORS 的 API 服务。' }
    }
    return { ok: false, message: `连接失败：${e?.message || '未知错误'}` }
  }
}

// 流式对话
export async function streamChat(
  messages: { role: string; content: string }[],
  onChunk: (text: string) => void,
  onDone?: () => void
) {
  const config = getApiConfig()
  if (!config.baseUrl || !config.apiKey) {
    onChunk('⚠️ 请先在「系统设置」页面配置 API URL 和 API Key，并通过连接测试后再使用 AI 功能。')
    onDone?.()
    return
  }

  const base = config.baseUrl.replace(/\/$/, '')

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o',
        messages,
        stream: true,
      }),
    })

    if (!res.ok || !res.body) {
      const err = await res.json().catch(() => ({}))
      onChunk(`❌ 请求失败：${err?.error?.message || `HTTP ${res.status}`}`)
      onDone?.()
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value).split('\n')
      for (const line of lines) {
        const trimmed = line.replace(/^data:\s*/, '').trim()
        if (!trimmed || trimmed === '[DONE]') continue
        try {
          const json = JSON.parse(trimmed)
          const delta = json?.choices?.[0]?.delta?.content
          if (delta) onChunk(delta)
        } catch {}
      }
    }
  } catch (e: any) {
    onChunk(`❌ 网络错误：${e?.message || '未知错误'}`)
  } finally {
    onDone?.()
  }
}
