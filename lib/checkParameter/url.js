const main = require('../../index')
const handleUrl = require('../handleUrl')
const request = require('../utils/request')
const DIS = require('../noticeRobot/DetectInfoSingleton')
const chalk = require('chalk')
const ora = require('ora')
const { red } = chalk
async function checkUrl(args) {
  // console.log(args)
  const { args: urls, min = false } = args
  let url = urls[0]
  if (url.indexOf('http') === -1) url = `https://${url}`

  DIS.setMainSite({ url })
  DIS.setOption({ url, min })
  const spinner = ora(`静态资源检测中...`).start()
  try {
    let { reps, data, httpsInfo, isRedirect } = await request({ url, m: min })
    const staticResourceRes = await handleUrl(data)
    spinner.stop()
    main({ staticResourceRes, mainSite: { reps, httpsInfo, url, isRedirect } })
  } catch (error) {
    spinner.fail(red(error))
  }
}

module.exports = checkUrl
