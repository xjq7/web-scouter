const formatMsg = require('./formatMsg')

class DetectInfoSingleton {
  constructor() {
    this.instance = null
    this.cdn = []
    this.cache = []
    this.zip = []
    this.http2 = []
    this.sourceSize = []
    this.mainSite = {}
    this.metrics = {}
    this.option = {}
    this.config = {}
  }
  static getInstance() {
    if (this.instance) return this.instance
    return (this.instance = new DetectInfoSingleton())
  }

  /**
   * 存储缓存检测信息
   * @date 2020-04-09
   * @param {Array|Object} param
   */
  setCache(param) {
    let { cache } = this
    if (param instanceof Array) {
      this.cache = cache.concat(param)
      return
    }
    this.cache.push(param)
  }

  setCdn(param) {
    let { cdn } = this
    if (param instanceof Array) {
      this.cdn = cdn.concat(param)
      return
    }
    this.cdn.push(param)
  }

  setZip(param) {
    let { zip } = this
    if (param instanceof Array) {
      this.zip = zip.concat(param)
      return
    }
    this.zip.push(param)
  }

  setHttp2(param) {
    let { http2 } = this
    if (param instanceof Array) {
      this.http2 = http2.concat(param)
      return
    }
    this.http2.push(param)
  }

  setSourceSize(param) {
    let { sourceSize } = this
    if (param instanceof Array) {
      this.sourceSize = sourceSize.concat(param)
      return
    }
    this.sourceSize.push(param)
  }
  setMainSite(param) {
    this.mainSite = { ...this.mainSite, ...param }
  }

  getMainSite() {
    return this.mainSite
  }

  setMetrics(param) {
    this.metrics = param
  }

  setOption(param) {
    this.option = param
  }
  getOption() {
    return this.option
  }

  getOption() {
    return this.option
  }

  setConfig(config) {
    this.config = config
  }

  getConfig() {
    return this.config
  }
  run() {
    const { cache, cdn, zip, http2, sourceSize, mainSite, metrics } = this
    const content = formatMsg({ cache, mainSite, cdn, zip, http2, sourceSize, metrics })
  }
}
module.exports = DetectInfoSingleton.getInstance()
