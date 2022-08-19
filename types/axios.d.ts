export interface Result<T = any> {
  msg: string
  code: number
  data?: T
}

export interface PaginationResult<T = any> {
  list: T[]

  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface PageRequestParams {
  page: number
  limit: number
}

export type ErrorMessageMode = 'messageBox' | 'message' | 'none' | undefined

export interface RequestOptions {
  /**
   * 格式化请求参数时间
   */
  formatDate?: boolean

  /**
   * 是否处理请求结果
   */
  isTransformResponse?: boolean

  /**
   * 是否返回原生响应结果
   * 例如：需要获取响应结果Header
   */
  isReturnNativeResponse?: boolean

  /**
   * 接口路径
   */
  apiUrl?: string

  /**
   * 是否加入时间戳
   */
  joinTimestamp?: boolean

  /**
   * 消息提示类型
   */
  errorMessageMode?: ErrorMessageMode

  /**
   * 忽略CancelToken
   */
  ignoreCancelToken?: boolean

  /**
   * 是否需要token验证
   */
  withToken?: boolean

  /**
   * 请求重试配置
   */
  retryRequest?: RetryRequest
}

export interface RetryRequest {
  /**
   * 开启失败请求重试
   */
  useRetry?: boolean

  /**
   * 失败重试次数
   */
  count?: number

  /**
   * 等待时间
   */
  waitTime?: number
}

// multipart/form-data: upload file
export interface UploadFileParams {
  /**
   * 其他参数
   */
  data?: Recordable

  /**
   * 文件参数接口字段名称
   */
  name?: string

  /**
   * 上传的文件
   */
  file: File | Blob

  /**
   * 文件名称
   */
  filename?: string

  [key: string]: any
}
