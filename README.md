# web-scouter

检查网站信息

<!-- ### 安装

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
``` -->

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
