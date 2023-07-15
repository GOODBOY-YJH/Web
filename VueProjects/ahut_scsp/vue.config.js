// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

module.exports = {
  // 配置打包目录
  publicPath: "/",
  pages: {
    index: {
      //入口
      entry: 'src/main.js',
    },
  },
  lintOnSave: false, //关闭语法检查
  devServer: {
    // 配置前端的域名访问权限
    allowedHosts: ['ahutahut.natapp1.cc']
  }
}
