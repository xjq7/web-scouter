const dayjs = require('dayjs')

function ssl({ instance, response, log }) {
  const {
    certInfo: { valid_from, valid_to, issuer },
  } = response

  const mechanism = issuer.O
  const startTime = dayjs(valid_from).format('YYYY/MM/DD')
  const endTime = dayjs(valid_to).format('YYYY/MM/DD')

  log.title('证书信息:')
  log.text(`证书机构: ${mechanism}`)
  log.text(`证书颁发时间: ${startTime}`)
  log.text(`证书到期时间: ${endTime}`)
}

module.exports = ssl
