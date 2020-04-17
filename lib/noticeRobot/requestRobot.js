const got = require('got')
const chalk = require('chalk')
const { red, green } = chalk
const testRobot = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=8595f314-71b2-4ddb-890f-bf65552370e7'

async function requestRobot(content) {
  try {
    let response = await got.post(testRobot, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          content,
        },
      }),
    })
    console.log(green('已成功通知机器人'))
  } catch (error) {
    console.log(red('通知机器人失败'))
    console.log(red(error))
  }
}

module.exports = requestRobot
