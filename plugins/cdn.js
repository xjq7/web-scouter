export default async function plugin({ succeed, fail, chalk: { white } }, options = {}) {
  const { staticResourceRes } = options
  for (let v of staticResourceRes) {
    let {
      cdn: { code, msg },
    } = v
    code === 1 ? succeed(msg) : fail(msg)
  }
  succeed(white(`cdn检查完毕`))
}
