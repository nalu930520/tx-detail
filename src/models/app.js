/* global window */

export default{
  namespace: 'app',
  state: {
    showSpinner: false,
    showPageLoading: false,
  },
  subscriptions: {
  },
  effects: {
  },
  reducers: {
    showSpinner (state) {
      return {
        ...state,
        showSpinner: true,
      }
    },
    hideSpinner (state) {
      return {
        ...state,
        showSpinner: false,
      }
    },
    showPageLoading (state) {
      return {
        ...state,
        showPageLoading: true,
      }
    },
    hidePageLoading (state) {
      return {
        ...state,
        showPageLoading: false,
      }
    },
  },
}
