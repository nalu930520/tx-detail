/* global window, native */

function initNative () {

  const _native = window.JSInterface || window._native || (typeof native !== 'undefined' && native) || null
  let getLanguage = () => 'cn'
  let closePage = () => console.log('debug-closePage:') // 关闭页面
  let setTitle = title => console.log(`debug-setTitle: ${title}`) // 设置 webview title
  let doPayment = () => console.log('debug-doPayment:') // 调用 app 输入密码
  let getToken = () => '' // 获取 token
  let getCurrencyConfig = code => console.log(`getCurrencyConfig code is ${code}`)
  let version = '1.0.0'
  let platform = 'web'
  let openSystemBrowser = url => console.log(`open system brower ${url}`)
  let refreshLastPage = () => ''
  let pushNativePage = () => ''
  if (_native) {
    getLanguage = () => _native.getLanguage().toLowerCase()
    closePage = () => _native.closePage()
    setTitle = title => _native.setTitle(title)
    getToken = () => _native.getToken()
    doPayment = id => _native.doPayment(id)
    getCurrencyConfig = (code) => {
      if (_native.currency(code)) {
        return JSON.parse(_native.currency(code))
      }
      return undefined
    }
    version = _native.version()
    platform = _native.platform()
    openSystemBrowser = url => _native.openSystemBrowser(url)
    refreshLastPage = () => _native.refreshLastPage()
    pushNativePage = (pageName, info) => _native.pushNativePage(pageName, info)
  }

  return {
    getLanguage,
    setTitle,
    closePage,
    getToken,
    doPayment,
    getCurrencyConfig,
    version,
    platform,
    openSystemBrowser,
    refreshLastPage,
    pushNativePage,
  }
}

module.exports = initNative()
