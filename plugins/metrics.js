const handleMetrics = require('../lib/handleMetrics')
export default async function plugin({ succeed, fail, chalk }, options = {}) {
  //无头浏览器检测
  await handleMetrics({ chalk, succeed, fail })

  succeed(chalk.white(`性能指标检测完毕`))
}
