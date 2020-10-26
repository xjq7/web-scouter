#!/usr/bin/env node
const { program } = require('commander')
const Instance = require('./instance')
const parseArgs = require('./parseArgs')
const package = require('../package.json')

const instance = new Instance()

program.version(`v${package.version}`, '-v,--version')

program.on('--help', () => {})

program
  .command('start <url>')
  .option('-o,--output', 'input path, output as pdf and save your path')
  .option('-m,--mobile', '移动端检测')
  .action((url, _program) => {
    instance.m = !!_program.mobile
    instance.url = url
  })

program.parse(process.argv)
const getArgv = parseArgs(program.rawArgs)

instance.getArgv = getArgv
instance.program = program

instance.check()
