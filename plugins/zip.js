export default async function plugin({ succeed, fail, chalk: { white } }, options = {}) {
  let { staticResourceRes } = options
  //输出js,css压缩方式
  for (let v of staticResourceRes) {
    let {
      zip: { code, msg },
    } = v
    code === 1 ? succeed(msg) : fail(msg)
  }
  succeed(white(`http 传输压缩方式检查完毕`))
}
