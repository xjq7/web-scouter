const handleMetrics = require('../lib/handleMetrics')
const handleGoogleInsight = require('../lib/handleGoogleInsight')
export default async function plugin({ succeed, fail, chalk }, options = {}) {
  //无头浏览器检测
  await handleMetrics({ chalk, succeed, fail })

  //google insight

  // await handleGoogleInsight({ chalk, succeed, fail })
  succeed(chalk.white(`性能指标检测完毕`))
}
