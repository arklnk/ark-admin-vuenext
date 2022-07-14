import type { AxiosError, AxiosInstance } from 'axios'
import type { CreateAxiosOptions } from './sAxios'

export class AxiosRetry {
  retry(axiosInstance: AxiosInstance, error: AxiosError) {
    const config = error.response?.config as CreateAxiosOptions & { __retryCount: number }
    const { waitTime = 100, count = 3 } = config?.requestOptions?.retryRequest || {}
    // init
    config.__retryCount = config.__retryCount || 0

    if (config.__retryCount < count) {
      config.__retryCount += 1

      // ignore promise error
      return this.delay(waitTime)
        .then(() => axiosInstance(config))
        .catch(() => {})
    }
  }

  private delay(waitTime: number) {
    return new Promise((resove) => setTimeout(resove, waitTime))
  }
}
