import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RequestOptions, Result } from '/#/axios'

export abstract class AxiosTransform {
  /**
   * 请求前配置
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig

  /**
   * 请求成功处理
   */
  transformResponseHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any

  /**
   * 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>

  /**
   * 请求拦截器
   */
  requestInterceptors?: (
    config: AxiosRequestConfig,
    options: Nullable<RequestOptions>
  ) => AxiosRequestConfig

  /**
   * 请求拦截器错误处理
   */
  requestInterceptorsCatch?: (e: Error) => void

  /**
   * 响应拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

  /**
   * 响应拦截器错误处理
   */
  responseInterceptorsCatch?: (res: AxiosInstance, e: Error) => void
}
