/* global window */
import axios from 'axios'
import qs from 'qs'
import compareVersions from 'compare-versions'
import lodashIsEmpty from 'lodash.isempty'
import { apiURL, appVersion } from './config'
import native from './native'


axios.defaults.baseURL = apiURL
const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options
  if (compareVersions(native.version, '2.28.0') >= 0) {
    axios.defaults.headers.common['token'] = native.getToken()
  } else {
    axios.defaults.headers.common['Authorization'] = `Bearer ${native.getToken()}`
  }
  axios.defaults.headers.common['app-version'] = `${native.platform}:${native.version}`
  axios.defaults.headers.common['app-language'] = native.getLanguage()
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(`${url}${!lodashIsEmpty(data) ? `?${qs.stringify(data)}` : ''}`)
    case 'post':
      const paramsObj = new URLSearchParams()
      for(const key in data) {
        paramsObj.append(`${key}`, data[key])
      }
      return axios.post(url, paramsObj)
    case 'put':
      const putObj = new URLSearchParams()
      for(const key in data) {
        putObj.append(`${key}`, data[key])
      }
      return axios.put(url, putObj)
    default:
      return axios(options)
  }
}

export default function request (options) {
  return fetch(options).then((response) => {
    const { statusText, status } = response
    let data = response.data
    return {
      success: true,
      message: statusText,
      status,
      ...data,
    }
  }).catch((error) => {
    console.log(error)
    const { response } = error
    let message
    let status
    if (response) {
      status = response.status
      const { data, statusText } = response
      message = data.message || statusText
    } else {
      status = 600
      message = 'Network Error'
    }
    return { success: false, status, message }
  })
}
