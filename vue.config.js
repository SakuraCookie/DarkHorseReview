const path = require('path')
module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/.svg$/)
      .include.add(path.resolve(__dirname, './src/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/.svg$/)
      .exclude.add(path.resolve(__dirname, './src/icons/svg'))
      .end()
      .use('file-loader')
      .loader('file-loader')
  },
  devServer: {
    // before: require('./mock/mock-server.js')
    // !请求路径: (域名+端口号)+baseURL+请求路径
    // !eg: http://localhost:9528/+/api+/sys/login = http://localhost:9528/api/sys/login
    // !目标路径: target+baseURL+请求路径
    // !eg: http://ihrm-java.itheima.net+/api+/sys/login = http://ihrm-java.itheima.net/api/sys/login
    proxy: {
      '/api': {
        target: 'http://hmmm-api.itheima.net',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
