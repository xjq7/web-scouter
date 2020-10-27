const ora = require('ora')

function project({ instance, response, log }) {
  const spinner = ora({ text: 'loading' })
  spinner.start()
  spinner.stop()
  log.title('项目信息:')
  const { headers, rawHeaders } = response

  if (/Strict-Transport-Security/gi.test(rawHeaders)) {
    log.text('HSTS 已开启')
  } else {
    log.text('HSTS 未开启')
  }

  const encodingValue = headers['content-encoding']
  if (encodingValue) {
    log.text(`已开启 ${encodingValue} 压缩`)
  }

  const crossValue = headers['access-control-allow-origin']
  if (crossValue) {
    log.text(`跨域配置: ${crossValue}`)
  } else {
    log.text(`未配置跨域`)
  }

  checkCache({ rawHeaders, headers, log })
}

function checkCache({ rawHeaders, headers, log }) {
  const cacheControlValue = headers['cache-control']

  if (/no-store/.test(cacheControlValue)) {
    log.text('禁止本地缓存')
    return
  }

  // 强缓存检测
  if (cacheControlValue && /max-age/g.test(cacheControlValue)) {
    const maxAge = cacheControlValue.split(',').find((v) => /max-age/g.test(v))

    if (maxAge) {
      let maxAgeTimes = Number(maxAge.split('=')[1])

      // 为0时,强制询问服务器
      if (maxAgeTimes !== 0) {
        let formatTimes = ''

        if (maxAgeTimes > 0 && maxAgeTimes < 60) {
          formatTimes = `${maxAgeTimes} 秒`
        } else if (maxAgeTimes >= 60 && maxAgeTimes < 3600) {
          maxAgeTimes = parseInt(maxAgeTimes / 60)
          formatTimes = `${maxAgeTimes} 分钟`
        } else if (maxAgeTimes >= 3600 && maxAgeTimes < 86400) {
          maxAgeTimes = parseInt(maxAgeTimes / 60 / 60)
          formatTimes = `${maxAgeTimes} 小时`
        } else if (maxAgeTimes >= 86400 && maxAgeTimes < 31536000) {
          maxAgeTimes = parseInt(maxAgeTimes / 60 / 60 / 24)
          formatTimes = `${maxAgeTimes} 天`
        } else {
          maxAgeTimes = parseInt(maxAgeTimes / 60 / 60 / 24 / 365)
          formatTimes = `${maxAgeTimes} 年`
        }

        log.text(`已开启强缓存,缓存时间为 ${formatTimes}`)
        return
      }
    }
  }

  // 协商缓存
  if (/etag|last-modified/i.test(rawHeaders.join())) {
    log.text('已开启协商缓存')
    return
  }
  log.text('缓存未开启')
}

module.exports = project
