const request = require('./utils/request')
const DIS = require('../lib/noticeRobot/DetectInfoSingleton')
const checkTool = require('./utils/checkTool')
const filter = require('./utils/filter')
function handleUrl(data) {
  const { sourceCheckBlackListFilter, filterStaticResource, blackMiniChunkSourceFilter } = filter
  let { url } = DIS.getMainSite()
  const reg = /(?:href|src)=((["']?)((https:\/\/)?)(.*?)(\.js|\.css|\.ico|>|\2))/g
  let urls = []
  let regRes = data.match(reg)
  //没有协议就加上协议,黑名单过滤
  if (regRes) {
    for (let v of regRes) {
      if (!sourceCheckBlackListFilter(v) && filterStaticResource(v)) {
        if (!blackMiniChunkSourceFilter(v)) {
          if (v.indexOf('http') === -1 && v.indexOf('//') === -1) {
            let relatedPath = v.split('=')[1]
            relatedPath = relatedPath.replace('"', '')
            if (url[url.length - 1] === '/') url = url.slice(0, url.length - 1)
            urls.push(`${url}${relatedPath}`)
          } else {
            urls.push(`https://${v.split('//')[1]}`)
          }
        }
      }
    }
  }
  urls = [...new Set(urls)]
  return urls
}

function saveRobotMsg({ cdn, cache, zip, http2, sourceSize }) {
  DIS.setCache(cache)
  DIS.setCdn(cdn)
  DIS.setZip(zip)
  DIS.setHttp2(http2)
  DIS.setSourceSize(sourceSize)
}

async function fetchUrls(data) {
  const { checkCdn, checkCache, checkHttp2, checkSourceSize, checkZip } = checkTool
  let urls = handleUrl(data)
  let res = []
  let promises = []
  let probePromises = []
  if (!urls.length) return []
  //这里需要请求两次,取第二次结果
  for (let v of urls) {
    probePromises.push(request({ url: v, headers: { 'Accept-Encoding': 'gzip, deflate, br' } }))
    promises.push(request({ url: v, headers: { 'Accept-Encoding': 'gzip, deflate, br' } }))
  }
  let results = []
  try {
    await Promise.all(probePromises)
    results = await Promise.all(promises)
  } catch (error) {
    // console.log(error)
  }
  results.forEach((item, index) => {
    let { reps, size } = item
    let { rawHeaders } = reps
    //过滤小于10kb的资源
    if (size / 1024 > 10 || urls[index].indexOf('app') !== -1) {
      //文件名
      let urlsStringArr = urls[index].split('/')
      let fileName = urlsStringArr[urlsStringArr.length - 1].split('?')[0]
      let deHashName = `${fileName.split('.').shift()}.${fileName.split('.').pop()}`
      //cdn
      const cdn = checkCdn(rawHeaders, deHashName)
      //cache
      const cache = checkCache(rawHeaders, deHashName)

      //压缩方式
      const zip = checkZip(rawHeaders, deHashName)

      //http2
      const http2 = checkHttp2(reps, deHashName)

      //sourceSize
      const sourceSize = checkSourceSize(size, deHashName)

      //将检测信息存储等待发送到机器人
      saveRobotMsg({ cdn, cache, zip, http2, sourceSize })
      //整个数组,每一项代表每个url的检测详情,注入到每个plugin中
      res.push({ name: deHashName, url: urls[index], cdn, cache, zip, http2, sourceSize, rawHeaders })
    }
  })
  return res
}

module.exports = fetchUrls
