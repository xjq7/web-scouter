function parseArgs(rawArgs) {
  const options = {
    output: '-o',
  }
  return (option) => {
    const findIndex = rawArgs.findIndex((v) => v === '--' + option || v === options[option])
    return rawArgs[findIndex + 1]
  }
}

module.exports = parseArgs
