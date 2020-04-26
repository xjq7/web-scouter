#!/usr/bin/env node
const { program } = require('commander')
const checkUrl = require('../lib/checkParameter/url')

program.version('v0.0.7', '-v,--version')

program.command('start').description('输入项目url地址开始检测').option('-m,--min', '移动端检测').action(checkUrl)

program.option('-h,--help', '查看帮助,更多信息前往 https://github.com/SummerJoan3/web-scouter')
program.parse(process.argv)

process.on('unhandledRejection', (err) => {
  // throw err
})
