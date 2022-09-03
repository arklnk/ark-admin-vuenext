import type { AxiosResponse, AxiosRequestConfig, AxiosError, AxiosInstance } from 'axios'
import type { AxiosTransform } from './axiosTransform'
import type { CreateAxiosOptions } from './sAxios'
import type { RequestOptions, Result } from '/#/axios'

import { isString, merge } from 'lodash-es'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '/@/enums/httpEnum'
import { useMessage } from '/@/composables/web/useMessage'
import { SAxios } from './sAxios'
import { formatRequestDate, joinTimestamp as joinTimestampHelper } from './helper'
import { getToken } from '../../auth'
import { useUserStore } from '/@/stores/modules/user'
import { usePermissionStore } from '/@/stores/modules/permission'
import { AxiosRetry } from './axiosRetry'
import { useTransl } from '/@/composables/core/useTransl'

const { createMessage, createMessageBox } = useMessage()

const transform: AxiosTransform = {
  /**
   * @description 处理请求数据，将接口数据转换成所需的格式
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions): any => {
    const { t } = useTransl()
    const { isTransformResponse, isReturnNativeResponse, errorMessageMode } = options
    // 返回原生响应
    if (isReturnNativeResponse) {
      return res
    }
    // 如果不需要处理返回的结果
    if (!isTransformResponse) {
      return res.data
    }

    const { data } = res
    if (!data) {
      throw new Error('response data empty')
    }

    const { data: result, msg: message, code } = data

    // 接口数据code判断是否成功
    const isSuccess = code === ResultEnum.SUCCESS
    if (isSuccess) {
      return result
    }

    // 错误描述信息
    const errMessage = `[${code}] ${message || t('common.http.requestFailed')}`

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    switch (code) {
      case ResultEnum.TOKEN_INVALID:
        // Token过期或Token无效则清除
        const userStore = useUserStore()
        const permissionStore = usePermissionStore()

        userStore.resetState()
        permissionStore.resetState()
        break
    }

    /**
     * errorMessageMode=‘messageBox’的时候会显示MessageBox错误弹窗，而不是消息提示，用于一些比较重要的错误
     * errorMessageMode=‘message’的时候会显示Message错误弹窗，而不是错误弹窗，用于一些比较简单的错误
     */
    if (errorMessageMode === 'messageBox') {
      createMessageBox
        .alert(errMessage, t('common.http.errorTip'), { type: 'error' })
        .catch(() => {})
    } else if (errorMessageMode === 'message') {
      createMessage.error(errMessage)
    }

    // throw
    throw new Error(errMessage)
  },

  /**
   * @description 请求之前处理config
   */
  beforeRequestHook: (config: AxiosRequestConfig, options: RequestOptions): AxiosRequestConfig => {
    const { apiUrl, formatDate, joinTimestamp = true } = options

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }

    const params = config.params || {}
    const data = config.data || false

    // 格式化时间
    formatDate && data && formatRequestDate(data)

    // 加入时间戳
    if (joinTimestamp) {
      if (!isString(params)) {
        // 请求加上时间戳参数
        config.params = Object.assign(params, joinTimestampHelper(joinTimestamp, false))
      } else {
        // 兼容 restful 风格
        config.url = config.url + params + `${joinTimestampHelper(joinTimestamp, true)}`
        config.params = undefined
      }
    }

    return config
  },

  /**
   * 请求拦截器处理
   */
  requestInterceptors: (
    config: AxiosRequestConfig,
    options: Nullable<RequestOptions>
  ): AxiosRequestConfig => {
    // Auth Jwt Token
    const token = getToken()

    if (token && options?.withToken !== false) {
      config.headers!['Authorization'] = token
    }

    return config
  },

  /**
   * 响应拦截器
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /**
   * 响应错误处理拦截器
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { t } = useTransl()
    const { config, response, message, code } = (error as AxiosError) || {}

    const errorMessageMode =
      (config as CreateAxiosOptions)?.requestOptions?.errorMessageMode || 'none'

    const err = error?.toString?.() || ''

    let errMessage = ''

    // axios timeout
    if (code === 'ECONNABORTED' && message?.indexOf('timeout') !== -1) {
      errMessage = t('common.http.requestTimeout')
    }

    if (err.includes('Network Error')) {
      errMessage = t('common.http.networkException')
    }

    // 检查status
    const status = response?.status
    switch (status) {
      case 401:
        errMessage = t('common.http.errMsg401')
        break
      case 403:
        errMessage = t('common.http.errMsg403')
        break
      case 404:
        errMessage = t('common.http.errMsg404')
        break
      case 405:
        errMessage = t('common.http.errMsg405')
        break
      case 500:
        errMessage = t('common.http.errMsg500')
        break
      case 503:
        errMessage = t('common.http.errMsg503')
        break
      default:
        errMessage = t('common.http.requestFailed')
    }

    /**
     * errorMessageMode=‘messageBox’的时候会显示MessageBox错误弹窗，而不是消息提示，用于一些比较重要的错误
     * errorMessageMode=‘message’的时候会显示Message错误弹窗，而不是错误弹窗，用于一些比较简单的错误
     */
    if (errorMessageMode === 'messageBox') {
      createMessageBox
        .alert(errMessage, t('common.http.errorTip'), { type: 'error' })
        .catch(() => {})
    } else if (errorMessageMode === 'message') {
      createMessage.error(errMessage)
    }

    // 请求重试
    const useRetry = (config as CreateAxiosOptions)?.requestOptions?.retryRequest?.useRetry
    if (useRetry) {
      const retryRequest = new AxiosRetry()
      // 安全起见只尝试GET请求重试
      config.method?.toUpperCase() === RequestEnum.GET && retryRequest.retry(axiosInstance, error)
    }

    return Promise.reject(error)
  },
}

function createAxios(opt?: Partial<CreateAxiosOptions>): SAxios {
  return new SAxios(
    merge(
      {
        timeout: 10000,
        // baseURL: import.meta.env.BASE_URL,
        headers: {
          'Content-Type': ContentTypeEnum.JSON,
        },
        // 数据处理
        transform,
        requestOptions: {
          isReturnNativeResponse: false,
          isTransformResponse: true,
          formatDate: true,
          errorMessageMode: 'message',
          apiUrl: import.meta.env.VITE_APP_BASE_API,
          joinTimestamp: false,
          ignoreCancelToken: true,
          withToken: true,
          retryRequest: {
            useRetry: false,
            waitTime: 100,
            count: 3,
          },
        },
      } as CreateAxiosOptions,
      opt || {}
    )
  )
}

export const defHttp = createAxios()
