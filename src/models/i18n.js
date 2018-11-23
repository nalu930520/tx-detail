import native from '../utils/native'

export default {
  namespace: 'i18n',
  state: {
    locale: 'cn',
    messages: null,
  },
  reducers: {
    setLocale (state, { payload }) {
      return Object.assign({}, state, {
        locale: payload.localization.locale,
        messages: payload.localization,
      })
    },
  },
  subscriptions: {
    set ({ dispatch, history }) {
      return history.listen(() => {
        let lang = native.getLanguage() || 'cn'
        dispatch({ type: 'fetchLocalization', payload: lang })
      }
      )
    },
  },
  effects: {
    * fetchLocalization ({ payload }, { put }) {
      const resData = yield import(`../mobi-app-localization/blob/Localization_${payload}.json`)
      yield put({ type: 'setLocale', payload: resData })
    },
  },
}
