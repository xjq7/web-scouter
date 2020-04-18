const requestGoogleInsight = require('../lib/utils/requestGoogleInsight')
const DIS = require('../lib/noticeRobot/DetectInfoSingleton')
const ora = require('ora')
let spinner

async function handleGoogleInsight({ chalk, succeed, fail }) {
  const { url } = DIS.getMainSite()
  const { min } = DIS.getOption()
  spinner = ora('Google网站性能分析中,请耐心等待...').start()
  try {
    let googleInsightRes = await requestGoogleInsight({ url, min })
    googleInsightRes = JSON.parse(googleInsightRes)
    const {
      lighthouseResult: { audits },
    } = googleInsightRes
    const FCP = audits['first-contentful-paint']
    const FCI = audits['first-cpu-idle']
    const EIL = audits['estimated-input-latency']
    const SI = audits['speed-index']
    spinner.stop()
    succeed(`Google网站性能分析中首屏加载时间 ${FCP.displayValue}`)
    succeed(`首次输入最长预估耗时 ${EIL.displayValue}`)
    succeed(`网页可视化速度 ${SI.displayValue}`)
    succeed(`首次 CPU 闲置时间 ${FCI.displayValue}`)
    // console.log(Object.keys(googleInsightRes))
    // console.log(googleInsightRes.loadingExperience.metrics)
    // console.log(googleInsightRes.originLoadingExperience.metrics)
    // console.log(googleInsightRes.lighthouseResult.audits)
  } catch (error) {
    spinner.stop()
    console.log(error)
  }

  //FIRST_CONTENTFUL_PAINT_MS

  //FIRST_INPUT_DELAY_MS  category

  //interactive   Time To Interactive

  //first-contentful-paint

  //first-cpu-idle
  //estimated-input-latency
}

module.exports = handleGoogleInsight
