export interface Result<T = any> {
  message: string
  code: number
  data: T
}

export type ErrorMessageMode = 'modal' | 'message' | 'none' | undefined

export interface RequestOptions {
  /**
   * 将请求参数拼接到url
   */
  joinParamsToUrl?: boolean

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
  file?: File | Blob

  /**
   * 文件名称
   */
  filename?: string

  [key: string]: any
}
