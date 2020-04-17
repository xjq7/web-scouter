const http = require('http')

function requestGoogleInsight({ url, min }) {
  const strategy = min ? 'mobile' : 'desktop'
  return new Promise((resolvs, reject) => {
    const options = {
      host: '172.96.196.212',
      path: `/googleInsight?url=${url}&strategy=${strategy}`,
      port: 3000,
      method: 'GET',
    }
    const request = http.request(options, function (response) {
      let str = ''
      response.on('data', function (data) {
        str += data
      })
      response.on('end', function () {
        const { code, results, msg } = JSON.parse(str)
        if (code === 1) {
          resolvs(results)
        } else {
          reject(msg)
        }
      })
    })

    request.on('error', function (e) {
      reject(e)
    })
    request.end()
  })
}

module.exports = requestGoogleInsight
