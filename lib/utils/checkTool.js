function checkCrossDomain(rawHeaders) {
  let acac = false,
    acaoIdx = -1,
    res = {}
  for (let i in rawHeaders) {
    let lowerV = rawHeaders[i].toLowerCase()
    if (lowerV.indexOf('access-control-allow-credentials')) acac = true
    if (lowerV.indexOf('access-control-allow-origin')) acaoIdx = Number(i)
  }
  if (acac) {
    if (rawHeaders[acaoIdx + 1] === '*') {
      res = { code: 0, msg: `存在跨域安全问题,请检查` }
    } else {
      res = { code: 1, msg: `跨域配置暂无安全问题` }
    }
  } else {
    res = { code: 1, msg: `跨域配置暂无安全问题` }
  }
  return res
}

function checkCdn(rawHeaders, name) {
  let strRawHeaders = rawHeaders.toString().toLowerCase()
  if (strRawHeaders.indexOf('x-cache') === -1) {
    return { code: 0, msg: `${name}  未通过 cdn 引入` }
  } else {
    if (strRawHeaders.indexOf('hit') !== -1) {
      return { code: 1, msg: `${name}  命中cdn缓存` }
    }
    return { code: 0, msg: `${name}  未命中cdn缓存` }
  }
}
function checkCache(rawHeaders, name) {
  let res = {}
  let strRawHeaders = rawHeaders.toString().toLowerCase()
  if (strRawHeaders.indexOf('cache-control,max-age=') !== -1) {
    if (name === 'index.html') {
      res = { code: 0, msg: `${name}  不应该开启资源本地强缓存,请检查` }
    } else {
      res = { code: 1, msg: `${name}  开启了资源本地强缓存` }
    }
  } else {
    if (name === 'index.html') {
      res = { code: 1, msg: `${name}  没有开启资源本地强缓存,正确` }
    } else {
      res = { code: 0, msg: `${name}  没有开启资源本地强缓存,请检查` }
    }
  }
  return res
}
function checkHttp2(reps, name) {
  if (reps.hasOwnProperty('httpVersion')) return { code: 1, msg: `${name}  正确开启了http2` }
  return { code: 0, msg: `${name}  没有开启http2,请检查` }
}
function checkHttps(httpsInfo) {
  if (!httpsInfo.open) return { code: 0, msg: `https证书未开启` }
  let res = {}
  const { valid_to } = httpsInfo.cert
  let now = new Date().getTime()
  let threeMon = 3 * 30 * 24 * 60 * 60 * 1000
  let end = new Date(valid_to).getTime()
  let diff = parseInt((end - now) / 1000 / 24 / 60 / 60)
  if (now + threeMon < end) {
    res = { code: 1, msg: `https 证书时长剩余 ${diff} 天` }
  } else {
    res = { code: 0, msg: `https 证书将要过期,时长剩余 ${diff} 天` }
  }

  return res
}

function checkHsts(rawHeaders) {
  let reg = /Strict-Transport-Security/i
  if (reg.test(rawHeaders.toString())) return { code: 1, msg: 'HSTS 已正确开启' }
  return { code: 0, msg: '站点未启用HSTS，有SSL剥离威胁' }
}

function checkZip(rawHeaders, name) {
  let idx = -1,
    regZip = /content-encoding/i,
    regContentLength = /content-length/i,
    contentLengthIdx = -1

  let res = {}
  for (let i in rawHeaders) {
    if (regContentLength.test(rawHeaders[i])) contentLengthIdx = Number(i)
    if (regZip.test(rawHeaders[i])) idx = Number(i)
  }

  if (contentLengthIdx !== -1 && rawHeaders[contentLengthIdx + 1] <= 1000) {
    return { code: 1, msg: `${name} 资源小于1KB,不用开启压缩` }
  }
  if (idx === -1) {
    res = { code: 0, msg: `${name}  没有开启任何压缩方式` }
  } else {
    res = { code: 1, msg: `${name}  开启了 ${rawHeaders[idx + 1]} 压缩` }
  }
  return res
}

function checkSourceSize(size, name) {
  let res = {}
  size = size / 1024

  size = size < 0.1 ? size.toFixed(3) + ' kb' : (size / 1024).toFixed(3) + ' mb'
  if (size / 1024 / 1024 > 1) {
    res = { code: 0, msg: `${name}  大小 ${size},超过 1 mb,请检查 ` }
  } else {
    res = { code: 1, msg: `${name}  大小 ${size}` }
  }
  return res
}

module.exports = {
  checkCdn,
  checkCache,
  checkHttp2,
  checkHttps,
  checkHsts,
  checkZip,
  checkSourceSize,
  checkCrossDomain,
}
