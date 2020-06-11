function formatMsg({ cache, mainSite, cdn, zip, http2, sourceSize, metrics }) {
  let content = ''
  //项目地址
  content += `#### [${mainSite.url}](${mainSite.url}) 检测情况,请相关同事检查\n`
  content += `---\n`
  content += `##### 主站检测情况:\n`
  const { https, mainSiteCache, mainSiteHttp2, hsts, redirectTime, mainSiteZip, crossDomain } = mainSite
  const mainSiteArr = [
    { title: '>https检测情况: ', checkRes: https },
    { title: '>缓存检测情况: ', checkRes: mainSiteCache },
    { title: '>hsts检测情况: ', checkRes: hsts },
    { title: '>http传输压缩检测情况: ', checkRes: mainSiteZip },
    { title: '>http2检测情况: ', checkRes: mainSiteHttp2 },
    { title: `>跨域配置检查情况: `, checkRes: crossDomain },
  ]
  for (let v of mainSiteArr) {
    content += checkCode(v.title, v.checkRes)
    content += '\n'
  }
  //重定向
  content += `>重定向检测情况: `
  content += redirectTime !== 0 ? fail('警告:有重定向产生') : success('没有发生重定向')

  //其他检测项数组
  let arr = [
    { title: '##### 缓存检测情况:\n', checkResArr: cache },
    { title: `##### cdn检测情况:\n`, checkResArr: cdn },
    { title: `##### http2检测情况:\n`, checkResArr: http2 },
    { title: `##### http传输压缩情况检测:\n`, checkResArr: zip },
    { title: `##### 资源大小检测情况:\n`, checkResArr: sourceSize },
  ]

  for (let v of arr) {
    if (v.checkResArr.length !== 0) {
      content += '\n---\n'
      content += v.title
      for (let v2 of v.checkResArr) content += checkCode('>', v2)
    }
  }

  //性能指标
  const { loadTime, total } = metrics
  content += '\n---\n'
  content += `##### 性能检测指标:\n`
  content += `>首页加载时间: <font color=\"green\"> ${loadTime} s</font>\n`
  content += `>加载资源总大小: <font color=\"green\"> ${total} mb</font>\n`
  return content
}

function checkCode(prefix, v) {
  if (v.code === 1) return `${prefix}${success(v.msg)}`
  return `${prefix}${fail(v.msg)}`
}

function success(msg) {
  return `<font color=\"green\">✓ ${msg}</font>\n`
}

function fail(msg) {
  return `<font color=\"red\">× ${msg}</font>\n`
}

module.exports = formatMsg
