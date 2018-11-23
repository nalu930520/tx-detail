/* global window */
import pathToRegexp from 'path-to-regexp'
import { Toast } from 'antd-mobile'
import { routerRedux } from 'dva/router'
import { fetchWallet, createSegwitAddress, fetchUserTransferFee, getDowngrade } from '../services/segwit'
import native from '../utils/native.js'

export default{
  namespace: 'segwit',
  state: {
    isOldUser: true,
    usedTicket: true,
    userTransfee: {
      userTicket: [{ num: 0 }, { num: 0 }],
      currencyCode: 'BTC',
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/segwit').exec(pathname)
        console.log(match)
        if (match) {
          dispatch({ type: 'app/hidePageLoading' })
          dispatch({ type: 'getWalletInfo' })
          dispatch({ type: 'getUserTransferFee' })
        }
      })
    },
  },
  effects: {
    * getUserTransferFee ({ payload }, { call, put }) {
      const resTransferFee = yield call(fetchUserTransferFee)
      if (resTransferFee.ret === 1) {
        let transferFee = {
          setfeeDiscount: resTransferFee.onchain_fee_discount_expected,
          setFreeDepositTimes: resTransferFee.deposit_fee.free_deposit_times,
          currencyCode: resTransferFee.currency_code,
          freeDepositAmount: resTransferFee.deposit_fee.free_deposit_amount,
          userTicket: [{
            type: '1',
            date: '(有效期一个月内，不可累计到次月。)',
            num: resTransferFee.deposit_fee.free_deposit_times - resTransferFee.deposit_times,
          },
          {
            type: '2',
            date: '',
            rate: `${resTransferFee.onchain_fee_discount_expected * 100}`,
            num: resTransferFee.onchain_fee_discount_times,
          }],
        }
        yield put({ type: 'saveTransfee', payload: transferFee })
      }
    },
    * getWalletInfo ({ payload }, { call, put }) {
      const resgetDowngrade = yield call(getDowngrade, 'switch_segwit')
      if (resgetDowngrade.ret === 1) {
        if (resgetDowngrade.v) {
          yield put(routerRedux.replace('/downPage'))
        } else {
          const resWallet = yield call(fetchWallet, 'btc')
          if (resWallet.ret === 1) {
            if (!resWallet.isSegwitAddr) {
              yield put(routerRedux.replace('/startSegwit'))
            } else {
              yield put(routerRedux.replace('/segwitAdress'))
            }
          }
        }
      }
    },
    * createSegwitAddress ({ payload }, { call, put }) {
      const resCreateSegwit = yield call(createSegwitAddress)
      Toast.hide()
      if (resCreateSegwit.ret === 1) {
        native.refreshLastPage()
        yield put({ type: 'getUserTransferFee' })
        yield put(routerRedux.replace('/segwitAdress'))
      } else {
        Toast.fail(resCreateSegwit.error, 2)
      }
    },
  },
  reducers: {
    saveTransfee (state, { payload }) {
      return {
        ...state,
        userTransfee: payload,
      }
    },
  },
}
