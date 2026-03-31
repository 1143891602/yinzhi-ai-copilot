import http from 'http'
import fetch from 'node-fetch'

const API_KEY = 'sk-21f97ac023f2ec9d093d484403592777146f70d8b169d751b8804a00780df3b6'
const API_BASE = 'https://vpsairobot.com'
const PORT = 3003

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // 读取请求体
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const body = Buffer.concat(chunks).toString()

  try {
    const targetUrl = `${API_BASE}${req.url}`
    console.log(`→ ${req.method} ${targetUrl}`)

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: req.method !== 'GET' ? body : undefined,
    })

    console.log(`← ${upstream.status}`)

    res.writeHead(upstream.status, {
      'Content-Type': upstream.headers.get('content-type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    })

    upstream.body.pipe(res)
  } catch (err) {
    console.error('Proxy error:', err.message)
    res.writeHead(500)
    res.end(JSON.stringify({ error: { message: err.message } }))
  }
})

server.listen(PORT, () => {
  console.log(`✅ Proxy running at http://localhost:${PORT}`)
  console.log(`   → https://vpsairobot.com`)
})
