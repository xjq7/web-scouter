const dns = require('dns')
const dnsPromises = dns.promises

function formatSize(size) {
  size /= 1024
  if (size < 1024) {
    return size.toFixed(2) + ' KB'
  }
  size /= 1024
  if (size < 1024) {
    return size.toFixed(2) + ' MB'
  }
  return size
}

async function base({ instance, response, log }) {
  log.title('基本信息:')

  const { headers, data } = response

  const url = instance.url
  const options = {
    family: 4,
  }

  const bodySize = formatSize(data.length)

  const parseUrl = new URL(url)
  try {
    const { address } = await dnsPromises.lookup(parseUrl.hostname, options)
    log.text(`IP地址: ${address}`)
  } catch (error) {}

  const webServer = headers.server
  log.text(`web服务器: ${webServer}`)
  // log.text(`实体大小: ${bodySize}`)
}

module.exports = base
