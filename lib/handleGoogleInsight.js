const requestGoogleInsight = require('../lib/utils/requestGoogleInsight')
const DIS = require('../lib/noticeRobot/DetectInfoSingleton')

async function handleGoogleInsight() {
  const { url } = DIS.getMainSite()
  const { min } = DIS.getOption()

  try {
    let googleInsightRes = await requestGoogleInsight({ url, min })
    // console.log(googleInsightRes)
    googleInsightRes = JSON.parse(googleInsightRes)
    const {
      lighthouseResult: { audits },
    } = googleInsightRes
    const { interactive } = audits
    const FCP = audits['first-contentful-paint']
    const FCI = audits['first-cpu-idle']
    const FMP = audits['first-meaningful-paint']
    const EIL = audits['estimated-input-latency']
    const SI = audits['speed-index']
    console.log(Object.keys(googleInsightRes))
    console.log(googleInsightRes.loadingExperience.metrics)
    console.log(googleInsightRes.originLoadingExperience.metrics)
    console.log(googleInsightRes.lighthouseResult.audits)
  } catch (error) {
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
