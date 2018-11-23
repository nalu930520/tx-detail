import { request } from 'utils'

export async function fetchWallet (parmas) {
  return request({
    url: `/wallet/${parmas}`,
    method: 'get',
  })
}

export async function createSegwitAddress () {
  return request({
    url: '/segwit/btc',
    method: 'post',
  })
}

export async function fetchUserTransferFee () {
  return request({
    url: '/transfer/fees',
    method: 'get',
  })
}

export async function getDowngrade (parmas) {
  return request({
    url: `/public/downgrade/config?service_name=${parmas}`,
    method: 'get',
  })
}
