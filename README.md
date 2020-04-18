# web-scouter

用于发版后对网页做健康检查

### 安装

#### 项目依赖安装

```bash
# 加速puppeteer的下载
npm set puppeteer_download_host https://npm.taobao.org/mirrors

# 全局安装puppeteer时设置不安全模式
npm config set unsafe-perm true

# 全局安装
npm i -g web-scouter

# 恢复安全模式
npm config set unsafe-perm false
```

#### 不同操作系统需要安装的依赖

- centos7 及以上版本(不支持 6 版本)

```bash
# 1.
sudo yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc

# 2.
yum update nss -y
```

### 使用

```bash
# 查看版本
web-scouter -v

# 查看帮助
web-scouter -h

# 检查网页  start <url>
web-scouter start https://www.baidu.com

# 检查移动端网页   命令缩写 -m,--min
web-scouter start https://m.baidu.com -m
```

### 输出信息

#### cdn

文件是否通过 cdn 方式引入

1. 未通过 cdn 引入,需要检查
2. 未命中 cdn 缓存,偶尔会出现检查误差
3. 命中 cdn 缓存, ✔

例如:

```bash
cdn ✔ index.js  未通过 cdn 引入
cdn ✖ index.css  命中 cdn 缓存
cdn ✖ app.js  没有命中cdn缓存
```

#### cache

文件是否开启缓存机制,首页 index.html 不需要被缓存

1. index.html 不能开强缓存
2. 其他静态资源都需要开启强缓存

例如:

```bash
cache ✖ vendor.js 没有开启资源本地强缓存,请检查
cache ✔ index.js  开启了资源本地缓存
```

#### sourceSize

js,css 打包文件大小的检测(经过 gzip 或 br 等在传输中压缩后的大小),小于 10kb 的文件跳过检查

例如:

```bash
sourceSize ✔ index.js  大小 0.65 mb
```

#### hsts

HTTP 严格传输安全模式是否开启

例如:

```bash
hsts ✖ 站点未启用HSTS，有SSL剥离威胁
```

#### zip

文件压缩格式(gzip、compress、deflate、br 等等)

例如:

```bash
zip ✔ index.html   开启了 gzip 压缩
zip ✔ index.css   开启了 br 压缩
```

#### mainSite

##### 主站的检测

index.html 缓存:不应该开启缓存
http 压缩方式
重定向检测:不允许重定向
hsts 检测
https 证书:检测 https 证书信息,时长,剩余时长小于 3 个月警告
跨域配置安全检测: Access-Control-Allow-Credentials 被设置为“true”时，Access-Control-Allow-Origin 不应该设置为“\*”，一来非常不安全，二来部分浏览器也会直接报错以示抗议。

例如:

```bash
mainSite ✔ index.html  没有开启资源本地缓存,正确
mainSite ✔ index.html  开启了 gzip 压缩
mainSite ✔ https 证书时长剩余 699 天
mainSite ✔ HSTS 已正确开启
mainSite ✔ index.html  正确开启了http2
mainSite ✔ 没有产生重定向
mainSite ✖ 存在跨域安全问题,请检查
```

#### metrics

网站性能指标检测,包含首页加载时间、首页加载全部请求资源大小、重定向检测...

例如:

```bash
metrics ✔ 首页加载时间 1.23 s
metrics ✔ 加载资源总大小 7.22 mb
```
