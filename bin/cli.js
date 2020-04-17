#!/usr/bin/env node
const { program } = require('commander')
const checkUrl = require('../lib/checkParameter/url')

program.version('v0.0.1', '-v,--version')

program
  .option('-u,--url', '项目url链接')
  .option('-m,--min', '移动端检测')
  .action((option, param) => checkUrl(option, param))

program.parse(process.argv)
