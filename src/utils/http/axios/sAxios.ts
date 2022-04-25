import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { AxiosTransform } from './axiosTransform'

import axios from 'axios'
import { RequestOptions } from '/#/axios'
import { AxiosCanceler } from './axiosCanceler'
import { isFunction } from 'lodash-es'

export interface CreateAxiosOptions extends AxiosRequestConfig {
  transform?: AxiosTransform
  requestOptions?: RequestOptions
}

export class SAxios {
  private axiosInstance: AxiosInstance
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  getTransform(): Nullable<AxiosTransform> {
    const { transform } = this.options
    return transform
  }

  setHeaders(headers: any): void {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  /**
   * 初始化拦截器
   */
  private setupInterceptors(): void {
    const transform = this.getTransform()
    if (!transform) {
      return
    }

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform

    const canceler = new AxiosCanceler()

    // request
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const ignoreCancel = this.options.requestOptions?.ignoreCancelToken

      !ignoreCancel && canceler.addPending(config)

      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options.requestOptions)
      }

      return config
    }, undefined)

    // request catch
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)

    // response
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && canceler.removePending(res.config)

      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }

      return res
    }, undefined)

    // response catch
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch)
  }
}
