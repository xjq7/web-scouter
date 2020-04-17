// 使用es模块
const loadEs = require('esm')(module, { cache: false })
const ora = require('ora')
const chalk = require('chalk')
const { red, green, cyan } = chalk
const DIS = require('./lib/noticeRobot/DetectInfoSingleton')
const tool = require('./lib/utils/checkTool')
const plugins = loadEs('./main.js')
module.exports = async function (options) {
  for (let v of Object.keys(plugins)) {
    const spinner = ora({
      prefixText: cyan(v),
    }).start()
    try {
      await plugins[v](
        {
          ...getSpinnerMethods(spinner),
          chalk,
          tool,
          DIS,
        } /**传入通用工具 */,
        { ...options } /** 命令行解析参数待传入 */
      )
    } catch (err) {
      spinner.fail(red(`检查出错：${err.message} 跳过该项`))
    }
  }
  // if (!options.option.notnotice) DIS.run()
}
function getSpinnerMethods(spinner) {
  return ['succeed', 'fail', 'warn', 'info'].reduce((acc, cur) => {
    acc[cur] = spinner[cur].bind(spinner)
    if (cur === 'succeed') {
      let succeedCp = acc[cur]
      acc[cur] = (msg) => succeedCp(green(msg))
    }
    if (cur === 'fail') {
      let failCp = acc[cur]
      acc[cur] = (msg) => failCp(red(msg))
    }
    return acc
  }, {})
}
