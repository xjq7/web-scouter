const plugins = require('../plugins')
const ora = require('ora')
const request = require('../lib/request')
const log = require('../lib/log')

function Instance(config) {
  const { getArgv, url, program } = config || {}
  this.url = url
  this.getArgv = getArgv
  this.program = program
  this.m = false
  this.isHttps = false
}

Instance.prototype.check = async function () {
  this.isHttps = this.url.slice(0, 5) === 'https'

  !this.isHttps && delete plugins.ssl

  const spinner = ora({ text: 'loading' }).start()

  try {
    const response = await request({ url: this.url, method: 'GET', headers: { 'Accept-Encoding': 'gzip, deflate, br' }, m: this.m })
    spinner.stop()

    for (const plugin of Object.values(plugins)) {
      await plugin({ instance: this, response, log })
    }
  } catch (error) {
    console.log(error)
    spinner.fail('地址无法访问')
  }

  return this
}

module.exports = Instance
