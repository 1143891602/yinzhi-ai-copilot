const API_BASE = 'http://localhost:3001/v1'
const API_KEY = 'sk-21f97ac023f2ec9d093d484403592777146f70d8b169d751b8804a00780df3b6'
const MODEL = 'gpt-5.4'

export async function streamChat(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  onChunk: (text: string) => void,
  onDone?: () => void
) {
  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
    }),
  })

  if (!res.ok || !res.body) {
    throw new Error(`API error: ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') {
        onDone?.()
        return
      }
      try {
        const json = JSON.parse(data)
        const text = json.choices?.[0]?.delta?.content
        if (text) onChunk(text)
      } catch {
        // skip malformed chunks
      }
    }
  }

  onDone?.()
}
