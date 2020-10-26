const https = require('https')
const http = require('http')

function request({ url, method, headers = {}, m }) {
  return new Promise((r, j) => {
    const isHttps = url.slice(0, 5) === 'https'
    const requestFunc = isHttps ? https : http
    const parseUrl = new URL(url)
    if (m) {
      headers['User-Agent'] =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
    }
    const options = { headers, method, path: parseUrl.pathname, hostname: parseUrl.hostname, port: isHttps ? 443 : 80 }
    const req = requestFunc.request(options, (res) => {
      const { statusCode } = res
      if (statusCode !== 200) {
        j()
      }
      if (isHttps) {
        res.certInfo = res.connection.getPeerCertificate()
      }

      const chunks = []
      res.on('data', (chunk) => {
        chunks.push(chunk)
      })
      res.on('end', () => {
        const data = chunks.toString()
        r({ ...res, data })
      })
    })

    req.on('error', (err) => {
      j(err)
    })
    req.end()
  })
}

module.exports = request
