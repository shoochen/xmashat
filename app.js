// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'xmashat-4gm748dsd68c6377',  // 你的云环境ID
        traceUser: true,
        timeout: 5000  // 设置请求超时时间
      })
    }
  }
})
