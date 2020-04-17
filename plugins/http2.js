//http2检测
export default async function plugin({ succeed, fail, chalk: { white } }, options = {}) {
  const { staticResourceRes } = options
  for (let v of staticResourceRes) {
    let {
      http2: { code, msg },
    } = v
    code === 1 ? succeed(msg) : fail(msg)
  }
  succeed(white(`http2 检查完毕`))
}
