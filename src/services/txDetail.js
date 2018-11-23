import { request } from 'utils'

export async function fetchTxDetail (parmas) {
  return request({
    url: '/transaction',
    method: 'get',
    data: { SN: parmas.SN },
  })
}

export async function fetchUserInfo (parmas) {
  return request({
    url: '/user/info/any_user_info',
    data: parmas,
    method: 'get',
  })
}

export async function fetchCoutrys () {
  return request({
    url: '/public/country',
  })
}

export async function undoTransaction (parmas) {
  return request({
    url: '/transfer/exchange_undo',
    data: parmas,
    method: 'post',
  })
}

export async function addMemo (parmas) {
  return request({
    url: '/transaction/memo',
    data: parmas,
    method: 'put',
  })
}

