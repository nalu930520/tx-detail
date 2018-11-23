/* global window */
import queryString from 'query-string'
import pathToRegexp from 'path-to-regexp'
import { Toast } from 'antd-mobile'
import { fetchTxDetail, fetchUserInfo, fetchCoutrys, undoTransaction, addMemo } from '../services/txDetail'
import native from '../utils/native'

export default{
  namespace: 'txDetail',
  state: {
    txDetailData: '',
    showNoteModal: false,
    textAreaRemark: '',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      // 返回按钮
      // alert(native.getLanguage())
      window.backButtonOnPress = () => {
        native.closePage()
      }
      history.listen(({ pathname, search }) => {
        console.log(search)
        const match = pathToRegexp('/txDetail').exec(pathname)
        if (match) {
          dispatch({ type: 'getTxDetail',
            payload: {
              ...queryString.parse(search),
            },
          })
        }
      })
      dispatch({ type: 'fetchCountrys' })
    },
  },
  effects: {
    * addMemo ({ payload }, { call, put, select }) {
      yield put({ type: 'app/showSpinner' })
      const resAddMemo = yield call(addMemo, payload)
      yield put({ type: 'app/hideSpinner' })
      if (resAddMemo.ret === 1) {
        const wallet = yield select(state => state.txDetail.wallet)
        const txDetailData = yield select(state => state.txDetail.txDetailData)
        const messages = yield select(state => state.i18n.messages)
        const sn = txDetailData.SN
        Toast.success(messages.success, 2)
        yield put({ type: 'getTxDetail', payload: { SN: sn, wallet } })
      } else {
        Toast.fail(resAddMemo.error, 2)
      }
      console.log(JSON.stringify(resAddMemo))
    },
    * getTxDetail ({ payload }, { call, put }) {
      const wallet = payload.wallet || ''
      yield put({ type: 'app/showPageLoading' })
      const resTxDetail = yield call(fetchTxDetail, payload)
      yield put({ type: 'app/hidePageLoading' })
      if (resTxDetail.ret === 1) {
        let txDetailData = resTxDetail.transactions[0]
        if (txDetailData.type === 5) {
          const resUserInfo = yield call(fetchUserInfo, { mobile: txDetailData.someone.split('-')[1], country_code: txDetailData.someone.split('-')[0] })
          if (resUserInfo.ret === 1) {
            txDetailData.userInfo = resUserInfo.customer_info
            const resCounrtys = yield call(fetchCoutrys)
            const countrys = resCounrtys.countries
            txDetailData.userInfo.mobileCode = countrys.find(country => country.iso2 === txDetailData.userInfo.country_code)
              .mobile_code
            if (!txDetailData.isPayer) {
              txDetailData.creatorMobile = txDetailData.creatorName.split('-')[1]
              txDetailData.creatorMobileCode = countrys.find(country => country.iso2 === txDetailData.creatorName.split('-')[0])
                .mobile_code
            }
          }
        }
        const textAreaRemark = txDetailData.memo
        yield put({ type: 'showTxDetail', payload: { txDetailData, wallet, textAreaRemark } })
      } else {
        alert(resTxDetail.error)
      }
    },
    * undoTransaction ({ payload }, { call, put, select }) {
      yield put({ type: 'app/showSpinner' })
      const resUndoTransaction = yield call(undoTransaction, payload)
      yield put({ type: 'app/hideSpinner' })
      if (resUndoTransaction.ret === 1) {
        try {
          native.refreshLastPage()
        } catch (error) {
          console.log(error)
        }
        const wallet = yield select(state => state.txDetail.wallet)
        yield put({ type: 'getTxDetail', payload: { SN: resUndoTransaction.transactions[0].SN, wallet } })
      } else {
        Toast.fail(resUndoTransaction.error)
      }
    },
  },
  reducers: {
    displayNoteModal (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    showTxDetail (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    updateTextAreaRemark (state, action) {
      return {
        ...state,
        textAreaRemark: action.payload
      }
    }
  },
}
