const request = require('../lib/utils/request')
const DIS = require('../lib/noticeRobot/DetectInfoSingleton')
export default async function plugin({ succeed, fail, chalk: { white }, tool }, options = {}) {
  let {
    mainSite: { url, httpsInfo, reps, redirectTime },
  } = options
  const { min } = DIS.getOption()
  let { rawHeaders } = reps
  const { checkHttps, checkHsts, checkHttp2, checkZip, checkCache, checkCrossDomain } = tool
  //缓存检测
  const cache = checkCache(rawHeaders, 'index.html')
  cache.code === 1 ? succeed(cache.msg) : fail(cache.msg)
  let zip = {}
  //压缩方式重新请求一遍,首次请求时压缩后需要解码
  //检测index.html压缩方式
  try {
    let res = await request({ url, headers: { 'Accept-Encoding': 'gzip, deflate, br' }, m: min })
    zip = checkZip(res.reps.rawHeaders, 'index.html')
    zip.code === 1 ? succeed(zip.msg) : fail(zip.msg)
  } catch (error) {
    fail(error)
  }

  //跨域检查
  const crossDomain = checkCrossDomain(rawHeaders)
  crossDomain.code === 1 ? succeed(crossDomain.msg) : fail(crossDomain.msg)

  const https = checkHttps(httpsInfo)
  https.code === 1 ? succeed(https.msg) : fail(https.msg)

  const hsts = checkHsts(rawHeaders)
  hsts.code === 1 ? succeed(hsts.msg) : fail(hsts.msg)

  const http2 = checkHttp2(reps, 'index.html')
  http2.code === 1 ? succeed(http2.msg) : fail(http2.msg)
  //输出重定向检测
  if (redirectTime) {
    fail('警告:有重定向产生')
  } else {
    succeed('没有产生重定向')
  }
  DIS.setMainSite({ url, hsts, mainSiteZip: zip, https, crossDomain, mainSiteHttp2: http2, redirectTime, mainSiteCache: cache })

  succeed(white(`主站点检测查完毕`))
}
