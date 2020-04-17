const urlCheck = require('../../config/url.json')

//资源检测黑名单过滤url
function sourceCheckBlackListFilter(url) {
  for (let v of Object.values(urlCheck.urlBlackList)) if (url.indexOf(v) !== -1) return true
  return false
}

//资源检测白名单过滤url
function sourceCheckWhiteListFilter(url) {
  for (let v of Object.values(urlCheck.urlWhiteList)) if (url.indexOf(v) !== -1) return true
  return false
}

//chunk小资源,三方资源黑名单过滤
function blackMiniChunkSourceFilter(url) {
  for (let v of Object.values(urlCheck.blackMiniChunkSource)) if (url.indexOf(v) !== -1) return true
  return false
}

//静态资源css、js筛选
function filterStaticResource(url) {
  let reg = /\.js|\.css/g
  return reg.test(url)
}

module.exports = {
  sourceCheckBlackListFilter,
  sourceCheckWhiteListFilter,
  blackMiniChunkSourceFilter,
  filterStaticResource,
}
