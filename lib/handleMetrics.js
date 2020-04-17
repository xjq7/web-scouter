const puppeteer = require('puppeteer')
const request = require('../lib/utils/request')
const DIS = require('./noticeRobot/DetectInfoSingleton')
const ora = require('ora')
let spinner

async function calculateAllResourceSize(urls) {
  let total = 0,
    promises = []
  //并行请求promises添加
  for (let v of urls) promises.push(request({ url: v, headers: { 'Accept-Encoding': 'gzip,deflate,br,compress' } }))
  //
  spinner = ora(`首页全部请求资源大小检测中...`).start()

  const allRequestRes = await Promise.all(promises)
  spinner.stop()
  for (let i in allRequestRes) total += allRequestRes[i].size / 1024 / 1024

  //保留两位小数
  total = total.toFixed(3)
  return total
}

//过滤视频文件
function filterUrl(url) {
  return !/.mp4|.avi/g.test(url)
}

async function handleMetrics({ chalk: { red }, succeed, fail }) {
  try {
    spinner = ora(`首页加载时间检测中...`).start()
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreDefaultArgs: ['--disable-extensions'],
    })
    const page = await browser.newPage({})

    //取参数
    let { url } = DIS.getMainSite()
    let { min } = DIS.getOption()
    //处理url
    if (url.indexOf('http') === -1) url = `https://${url}`

    //存储页面所有请求的http链接
    let urls = new Set([])

    //添加到urls
    page._client.on('Network.dataReceived', (event) => {
      try {
        const request = page._frameManager._networkManager._requestIdToRequest.get(event.requestId)
        let url = request.url()
        if (url.indexOf('http') !== -1 && filterUrl(url)) urls.add(url)
      } catch (error) {
        // console.log(error)
      }
    })

    await page.setRequestInterception(true)

    page.on('requestfailed', (request) => {
      // console.log(request.url() + ' ' + request.failure().errorText)
    })
    //设置请求头
    page.on('request', (request) => {
      const headers = request.headers()
      // headers['Accept-Encoding'] = 'gzip,deflate,br,compress'
      if (min) {
        headers['User-Agent'] =
          'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
      }
      request.continue({
        headers: {
          Accept: '*/*',
          ...headers,
        },
      })
    })

    // await page.setDefaultNavigationTimeout(0)

    await page.goto(url)
    spinner.stop()

    //API提供的指标
    const getMetrics = await page.metrics()

    //加载时间
    const { LayoutDuration, RecalcStyleDuration, TaskDuration } = getMetrics
    let loadTime = (LayoutDuration + RecalcStyleDuration + TaskDuration).toFixed(3)
    succeed(`首页加载时间 ${loadTime} s`)

    //计算首次全部请求资源大小
    total = await calculateAllResourceSize(urls)
    succeed(`加载资源总大小 ${total} mb`)
    DIS.setMetrics({ loadTime, total })
    await browser.close()
  } catch (error) {
    console.log(`\n${red(error)}`)
    fail('\n首页加载出现一些错误')
    process.exit(1)
  }
}

module.exports = handleMetrics
