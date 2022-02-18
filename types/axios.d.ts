import type { Ref } from 'vue'
import type { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'

export interface UseAxiosReturn<T> {
  /**
   * Axios Response
   */
  response: Ref<AxiosResponse<T> | undefined>

  /**
   * Axios response data
   */
  data: Ref<T | undefined>

  /**
   * Indicates if the request has finished
   */
  isFinished: Ref<boolean>

  /**
   * Indicates if the request is currently loading
   */
  isLoading: Ref<boolean>

  /**
   * Indicates if the request was canceled
   */
  aborted: Ref<boolean>

  /**
   * Any errors that may have occurred
   */
  error: Ref<AxiosError<T> | undefined>

  /**
   * Aborts the current request
   */
  abort: (message?: string | undefined) => void

  /**
   * Manually call the axios request
   */
  execute: (config?: AxiosRequestConfig) => void
}

export interface UseAxiosOptions {
  /**
   * Will automatically run axios request when `useAxios` is used
   *
   * @default true
   */
  immediate?: boolean
}
