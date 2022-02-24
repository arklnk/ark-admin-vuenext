// import type { AxiosRequestConfig, Axios } from 'axios'

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
 * overwite default return type
 */
declare module 'axios' {
  export interface AxiosInstance extends Axios {
    (config: AxiosRequestConfig): BaseResultPromise
    (url: string, config?: AxiosRequestConfig): BaseResultPromise
  }
}
