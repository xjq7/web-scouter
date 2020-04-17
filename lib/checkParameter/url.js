const main = require('../../index')
const handleUrl = require('../handleUrl')
const request = require('../utils/request')
const DIS = require('../noticeRobot/DetectInfoSingleton')
const chalk = require('chalk')
const ora = require('ora')
const { red } = chalk
async function checkUrl(option, param) {
  // console.log(red('不合法'))
  // process.exit(1)
  let url = param[0]
  DIS.setMainSite({ url })
  DIS.setOption({ url, min: option.hasOwnProperty('min'), notnotice: option.hasOwnProperty('notnotice') })
  const spinner = ora(`Loading`).start()
  try {
    let { reps, data, httpsInfo, isRedirect } = await request({ url, m: option.min })
    const staticResourceRes = await handleUrl(data)
    spinner.stop()
    main({ staticResourceRes, mainSite: { reps, httpsInfo, url, isRedirect }, option })
  } catch (error) {
    spinner.fail(red(error))
  }
}

module.exports = checkUrl
