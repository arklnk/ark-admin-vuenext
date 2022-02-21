import type { AxiosRequestConfig, Axios } from 'axios'

/**
 * base result
 */
export interface BaseResult<T = any> {
  message: string
  code: number
  data?: T
}

/**
 * custom axios instance result
 */
export type BaseResultPromise<T = any> = Promise<BaseResult<T>>

/**
 * @description custom axios instance
 */
export interface SFAxiosInstance extends Axios {
  (config: AxiosRequestConfig): BaseResultPromise
  (url: string, config?: AxiosRequestConfig): BaseResultPromise
}
