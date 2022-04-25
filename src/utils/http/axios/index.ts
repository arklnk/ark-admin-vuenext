import type { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import type { AxiosTransform } from './axiosTransform'
import type { RequestOptions, Result } from '/#/axios'

import { isString } from 'lodash-es'
import { ResultEnum } from '/@/enums/httpEnum'
import { formatRequestDate, joinTimestamp as joinTimestampHelper } from './helper'
import { getToken } from '../../auth'
import { CreateAxiosOptions } from './sAxios'

const UnknownErrorMsg = '未知错误,请稍候重试!'

const transform: AxiosTransform = {
  /**
   * @description 处理请求数据，将接口数据转换成所需的格式
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions): any => {
    const { isTransformResponse, isReturnNativeResponse } = options
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
      throw new Error(UnknownErrorMsg)
    }

    const { data: result, message, code } = data

    // 接口数据code判断是否成功
    const isSuccess = code === ResultEnum.SUCCESS
    if (isSuccess) {
      return result
    }

    // 抛出业务异常
    throw new Error(message || UnknownErrorMsg)
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
  responseInterceptorsCatch: (error: any) => {
    const { config, response, message, code } = (error as AxiosError) || {}

    const errorMessageMode =
      (config as CreateAxiosOptions)?.requestOptions?.errorMessageMode || 'none'

    const msg = response?.data?.message || ''
    const err = error?.toString?.() || ''

    let errMessage = ''

    if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
      errMessage = '接口请求超时,请刷新页面重试!'
    }

    if (err.includes('Network Error')) {
      errMessage = '网络异常，请检查您的网络连接是否正常!'
    }

    // 检查status
    const status = response?.status

    switch (status) {
      // 业务类型错误代码
      case 200:
        errMessage = msg
        break
      case 404:
        errMessage = '网络请求错误,未找到该资源!'
        break
      case 500:
        errMessage = '服务器错误,请联系管理员!'
        break
      case 422:
        errMessage = '服务器无法处理该请求,请检查参数!'
      default:
    }

    /**
     * errorMessageMode=‘messageBox’的时候会显示MessageBox错误弹窗，而不是消息提示，用于一些比较重要的错误
     * errorMessageMode=‘message’的时候会显示Message错误弹窗，而不是错误弹窗，用于一些比较简单的错误
     */
    if (errorMessageMode === 'messageBox') {
      // TODO
    } else if (errorMessageMode === 'message') {
      // TODO
    }
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    return Promise.reject(error)
  },
}
