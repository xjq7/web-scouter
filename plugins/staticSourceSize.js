export default async function plugin({ succeed, fail, chalk: { white } }, options = {}) {
  const { staticResourceRes } = options
  for (let v of staticResourceRes) {
    let {
      sourceSize: { code, msg },
    } = v
    code === 1 ? succeed(msg) : fail(msg)
  }
  succeed(white(`静态资源检查完毕`))
}
