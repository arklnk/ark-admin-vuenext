import type { AxiosRequestConfig, Canceler } from 'axios'
import axios from 'axios'

// 请求集合
let pendingMap = new Map<string, Canceler>()

export function getPendingUrl(config: AxiosRequestConfig): string {
  return [config.method, config.url].join('&')
}

export class AxiosCanceler {
  /**
   * add request
   * @param config
   */
  addPending(config: AxiosRequestConfig) {
    this.removePending(config)

    const url = getPendingUrl(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          // 如果没有挂起当前的请求则添加
          pendingMap.set(url, cancel)
        }
      })
  }

  /**
   * remove request
   * @param config
   */
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config)

    if (pendingMap.has(url)) {
      // 如果挂起中有当前请求标识符
      // 取消并删除当前请求
      const cancel = pendingMap.get(url)

      cancel && cancel(url)
      pendingMap.delete(url)
    }
  }

  /**
   * remove all pending request
   */
  removeAllPending() {
    pendingMap.forEach((cancel, url) => {
      cancel && cancel(url)
    })

    pendingMap.clear()
  }

  /**
   * reset
   */
  reset() {
    pendingMap = new Map<string, Canceler>()
  }
}
