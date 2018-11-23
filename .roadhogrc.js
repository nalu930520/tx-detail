const path = require('path')

export default {
  entry: 'src/index.js',
  theme: "./theme.config.js",
  outputPath: './dist',
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr",
        "transform-runtime",
        "syntax-dynamic-import",
        ['import', { 'libraryName': 'antd-mobile', 'libraryDirectory': 'lib', 'style': true }]
      ]
    },
    staging: {
      publicPath: '/txDetail/',
      extraBabelPlugins: [
        "transform-runtime",
        "syntax-dynamic-import",
        ['import', { 'libraryName': 'antd-mobile', 'libraryDirectory': 'lib', 'style': true }]
      ]
    },
    preProduction: {
      publicPath: '/txDetail/',
      extraBabelPlugins: [
        "transform-runtime",
        "syntax-dynamic-import",
        ['import', { 'libraryName': 'antd-mobile', 'libraryDirectory': 'lib', 'style': true }]
      ]
    },
    production: {
      publicPath: 'https://static.mobimecdn.com/txDetail/',
      extraBabelPlugins: [
        "transform-runtime",
        "syntax-dynamic-import",
        ['import', { 'libraryName': 'antd-mobile', 'libraryDirectory': 'lib', 'style': true }]
      ]
    }
  },
  dllPlugin: {
    exclude: ["babel-runtime", "roadhog", "cross-env"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
  }
}
