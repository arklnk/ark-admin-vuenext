import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { AxiosTransform } from './axiosTransform'
import type { RequestOptions, Result, UploadFileParams } from '/#/axios'

import axios from 'axios'
import qs from 'qs'
import { AxiosCanceler } from './axiosCanceler'
import { cloneDeep, isFunction } from 'lodash-es'
import { ContentTypeEnum } from '/@/enums/httpEnum'

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
      this.axiosInstance.interceptors.response.use(undefined, (error) => {
        return responseInterceptorsCatch(this.axiosInstance, error)
      })
  }

  /**
   * file upload
   */
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new FormData()
    const customFileName = params.name || 'file'

    if (params.filename) {
      formData.append(customFileName, params.file, params.filename)
    } else {
      formData.append(customFileName, params.file)
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach((valueItem) => {
            formData.append(`${key}[]`, valueItem)
          })
        } else {
          formData.append(key, value)
        }
      })
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': ContentTypeEnum.FORM_DATA,
      },
    })
  }

  /**
   * support form data
   */
  supportFormData(config: AxiosRequestConfig): AxiosRequestConfig {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !config.data ||
      config.method?.toUpperCase() === 'GET'
    ) {
      return config
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    }
  }

  /**
   * axios request hook
   */
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config)
    const transform = this.getTransform()

    // merge options
    const { requestOptions } = this.options
    const opt: RequestOptions = Object.assign({}, requestOptions, options)

    // hook
    const { transformResponseHook, beforeRequestHook, requestCatchHook } =
      transform || ({} as AxiosTransform)

    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    conf.requestOptions = opt

    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              const ret = transformResponseHook(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          // no hook
          resolve(res as unknown as Promise<T>)
        })
        .catch((err: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(err, opt))
            return
          }
          reject(err)
        })
    })
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' }, options)
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' }, options)
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' }, options)
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' }, options)
  }
}
