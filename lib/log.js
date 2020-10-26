class Log {
  title(value) {
    console.log(`\n  ${value}\n`)
  }
  text(value) {
    console.log(`       ${value}`)
  }
}

module.exports = new Log()
