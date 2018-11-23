import 'babel-polyfill'
import 'url-search-params-polyfill'
import dva from 'dva'
import { addLocaleData } from 'react-intl'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import native from './utils/native'

const lang = native.getLanguage() || 'en'

import(`./mobi-app-localization/blob/Localization_${lang}.json`)
  .then((data) => {
    const localizationObject = Object.assign({
      pluralRuleFunction: () => {
        return 'other'
      },
    }, data.localization)
    addLocaleData(localizationObject)
    // 1. Initialize
    const app = dva({
      ...createLoading({
        effects: true,
      }),
      history: createHistory(),
      onError (error) {
        console.log(error.message)
      },
    })

    // 2. Model

    app.model(require('./models/app'))
    app.model(require('./models/txDetail'))
    app.model(require('./models/segwit'))
    app.model(require('./models/i18n'))

    // 3. Router
    app.router(require('./router'))

    // 4. Start
    app.start('#root')
  })

