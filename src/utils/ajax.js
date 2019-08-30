import axios from 'axios'
import { message, Modal } from 'antd'
import { omit } from 'lodash'

let showingError = false

const loadingIndicator = (() => {
  const DELAY = 300
  let handler = null
  let timerId = 0

  return {
    show: () => {
      if (timerId) {
        clearTimeout(timerId)
        timerId = 0
      }

      if (handler) { // is showing
        return
      } else {
        handler = message.loading('加载中...', 0)
      }
    },
    hide: () => {
      // 延迟调用 hide，避免了在短时间内（DELAY）多次调用 show() 而导致的弹出多个 indicator
      timerId = setTimeout(() => {
        if (handler) {
          handler()
          handler = null
        }
      }, DELAY)
    }
  }
})()

window.loader = loadingIndicator

const request = (method, ...args) => {
  let showLoadingIndicator = true
  if (args[1] && 'showLoadingIndicator' in args[1]) {
    showLoadingIndicator = !!args[1].showLoadingIndicator
    delete args[1].showLoadingIndicator
  }

  showLoadingIndicator && loadingIndicator.show()

  return axios[method](...args).catch(e => {
    showLoadingIndicator && loadingIndicator.hide()
    // message.error('请求错误')
    throw e // will handle in app.onError defined in index.js
  }).then(({ status, statusText, data, headers }) => {
    showLoadingIndicator && loadingIndicator.hide()

    if (data.statusCode === 0) {
      return data.data
    } else if (data.statusCode === -1) {
      // message.error(`${data.error.code}: ${data.error.message}`)
      console.warn(data.error)
      throw new Error(data.error.message) // will handle in app.onError defined in index.js
    } else if (data.statusCode === -2) {
      if (!showingError) {
        Modal.error({
          title: '接口授权失败',
          content: '当前用户在其他地方登录，请重新登录',
          onOk: () => {
            showingError = false
            redirectToLogin()
          }
        })
        showingError = true
      }

      throw new Error('接口授权失败')
    } else if (data.statusCode === 1) {
      // message.error('请求参数错误')
      data.details.forEach(d => message.error(d.message))
      throw new Error('请求参数错误') // will handle in app.onError defined in index.js
    } else {
      throw new Error(data.error.message)
    }
  })
}

export default {
  get: (...args) => request('get', ...args),
  post: (...args) => request('post', ...args),
  put: (...args) => request('put', ...args),
  delete: (...args) => request('delete', ...args),
}

export const redirectToLogin = () => {
  const redirectTo = encodeURIComponent(window.location.hash.substring(1))
  window.location.href = `?redirectTo=${redirectTo}`
}
