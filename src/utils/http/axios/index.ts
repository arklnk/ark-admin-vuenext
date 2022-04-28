import type { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import type { AxiosTransform } from './axiosTransform'
import type { CreateAxiosOptions } from './sAxios'
import type { RequestOptions, Result } from '/#/axios'

import { isString, merge } from 'lodash-es'
import { ContentTypeEnum, ResultEnum } from '/@/enums/httpEnum'
import { useMessage } from '/@/hooks/web/useMessage'
import { SAxios } from './sAxios'
import { formatRequestDate, joinTimestamp as joinTimestampHelper } from './helper'
import { getToken } from '../../auth'
import { useUserStore } from '/@/stores/modules/user'
import { usePermissionStore } from '/@/stores/modules/permission'

const UnknownErrorMsg = '未知错误,请稍候重试!'
const ErrorTip = '错误提示'

const { createMessage, createMessageBox } = useMessage()

const transform: AxiosTransform = {
  /**
   * @description 处理请求数据，将接口数据转换成所需的格式
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions): any => {
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
      throw new Error(UnknownErrorMsg)
    }

    const { data: result, message, code } = data

    // 接口数据code判断是否成功
    const isSuccess = code === ResultEnum.SUCCESS
    if (isSuccess) {
      return result
    }

    // 错误描述信息
    let errMessage = ''

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    switch (code) {
      case ResultEnum.TOKEN_INVALID:
      case ResultEnum.TOKEN_EXPIRE:
        // Token过期或Token无效则清除
        const userStore = useUserStore()
        const permissionStore = usePermissionStore()

        userStore.resetState()
        permissionStore.resetState()

        errMessage = `[${code}] ${message},请重新登录`
        break
      default:
        errMessage = `[${code}] ${message}`
    }

    /**
     * errorMessageMode=‘messageBox’的时候会显示MessageBox错误弹窗，而不是消息提示，用于一些比较重要的错误
     * errorMessageMode=‘message’的时候会显示Message错误弹窗，而不是错误弹窗，用于一些比较简单的错误
     */
    if (errorMessageMode === 'messageBox') {
      createMessageBox.alert(errMessage, ErrorTip, { type: 'error' }).catch(() => {})
    } else if (errorMessageMode === 'message') {
      createMessage.error(errMessage)
    }

    // throw
    throw new Error(errMessage || UnknownErrorMsg)
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

    const err = error?.toString?.() || ''

    let errMessage = ''

    // axios timeout
    if (code === 'ECONNABORTED' && message?.indexOf('timeout') !== -1) {
      errMessage = '接口请求超时,请刷新页面重试!'
    }

    if (err.includes('Network Error')) {
      errMessage = '网络异常，请检查您的网络连接是否正常!'
    }

    // 检查status
    const status = response?.status
    switch (status) {
      case 404:
        errMessage = '网络请求错误,未找到该资源!'
        break
      case 422:
        errMessage = '参数错误,服务器无法响应!'
        break
      case 405:
        errMessage = '网络请求错误,请求方法未允许!'
        break
      case 500:
        errMessage = '服务器错误,请联系管理员!'
        break
      case 503:
        errMessage = '服务不可用，服务器暂时过载或维护!'
        break
      default:
    }

    /**
     * errorMessageMode=‘messageBox’的时候会显示MessageBox错误弹窗，而不是消息提示，用于一些比较重要的错误
     * errorMessageMode=‘message’的时候会显示Message错误弹窗，而不是错误弹窗，用于一些比较简单的错误
     */
    if (errorMessageMode === 'messageBox') {
      createMessageBox.alert(errMessage, ErrorTip, { type: 'error' }).catch(() => {})
    } else if (errorMessageMode === 'message') {
      createMessage.error(errMessage)
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
        },
      } as CreateAxiosOptions,
      opt || {}
    )
  )
}

export const defHttp = createAxios()
