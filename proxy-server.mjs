import http from 'http'
import https from 'https'

const API_KEY = 'sk-21f97ac023f2ec9d093d484403592777146f70d8b169d751b8804a00780df3b6'
const TARGET_HOST = 'vpsairobot.com'
const PORT = 3001

const server = http.createServer((req, res) => {
  // CORS headers — allow requests from localhost:3000
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const options = {
    hostname: TARGET_HOST,
    port: 443,
    path: req.url,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'Host': TARGET_HOST,
      'Origin': `https://${TARGET_HOST}`,
      'Referer': `https://${TARGET_HOST}/`,
      'User-Agent': 'Mozilla/5.0',
    },
  }

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      'Content-Type': proxyRes.headers['content-type'] || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    })
    proxyRes.pipe(res)
  })

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err)
    res.writeHead(500)
    res.end(JSON.stringify({ error: err.message }))
  })

  req.pipe(proxyReq)
})

server.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`)
})
