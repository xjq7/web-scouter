export default async function plugin({ succeed, fail, chalk: { white } }, options = {}) {
  const { staticResourceRes } = options
  for (let v of staticResourceRes) {
    const {
      cache: { code, msg },
    } = v
    code === 1 ? succeed(msg) : fail(msg)
  }
  succeed(white(`cache检查完毕`))
}
