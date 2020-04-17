const https = require('https')
const http = require('http')
const chalk = require('chalk')
const { red } = chalk

function handleRedirect({ params, response }) {
  const { rawHeaders } = response
  let LocationIdx = 0
  // console.log(params)
  params.redirectTime++
  for (let i in rawHeaders) if (rawHeaders[i] === 'Location') LocationIdx = Number(i)
  let redirectUrl = rawHeaders[LocationIdx + 1]
  delete params.options.headers['User-Agent']
  params.url = redirectUrl
  // console.log(redirectUrl)
  if (redirectUrl.indexOf('https') !== -1) {
    httpsReq(params)
  } else {
    httpReq(params)
  }
}

function checkRedirect(response) {
  let { statusCode } = response
  if (statusCode > 300 && statusCode < 400) return true
  return false
}

function httpReq(params) {
  let { options, url, resolve, reject, redirectTime } = params
  url = url.replace('https', 'http')
  try {
    http
      .get(url, options, (response) => {
        let data = ''
        const isRedirect = checkRedirect(response)

        if (isRedirect) {
          handleRedirect({ params, response })
          return
        }
        let chunks = []
        response.on('data', (chunk) => {
          data += chunk
          chunks.push(chunk)
        })
        response.on('end', () => {
          let size = chunks.toString().length
          resolve({ data, size, reps: response, httpsInfo: { open: false }, redirectTime })
        })
      })
      .on('error', (err) => {
        if (err.code.indexOf('ENOTFOUND') !== -1) reject(red('请输入正确的url'))
      })
  } catch (err) {
    reject(err)
  }
}

function httpsReq(params) {
  let { options, url, resolve, reject, redirectTime } = params
  try {
    https
      .get(url, options, (response) => {
        let data = ''
        const isRedirect = checkRedirect(response)
        if (isRedirect) {
          handleRedirect({ params, response })
          return
        }
        const cert = response.connection.getPeerCertificate()
        let chunks = []
        response.on('data', (chunk) => {
          data += chunk
          chunks.push(chunk)
        })
        response.on('end', () => {
          let size = chunks.toString().length
          resolve({ data, size, reps: response, httpsInfo: { open: true, cert }, redirectTime })
        })
      })
      .on('error', (err) => {
        if (err.code === 'ECONNREFUSED') reject('连接被拒绝')
        params.url = params.url.replace('https', 'http')
        httpReq(params)
      })
  } catch (err) {
    if (err.code.indexOf('ERR_INVALID_URL') !== -1) reject(red('请输入正确的url'))
    reject(err)
  }
}

function request({ url, m = false, headers = {} }) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Accept: '*/*',
        'Accept-Language': 'zh-CN,en-US;q=0.8,en;q=0.6',
        ...headers,
      },
    }

    options.headers['User-Agent'] = m
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
      : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
    if (url.indexOf('https') === -1) {
      url = url.indexOf('http') === -1 ? `https://${url}` : url.replace('http', 'https')
    }
    const redirectTime = 0
    let params = {
      options,
      url,
      resolve,
      reject,
      redirectTime,
    }

    httpsReq(params)
  })
}

module.exports = request
