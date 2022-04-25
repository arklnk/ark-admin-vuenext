import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { isObject, isString } from 'lodash-es'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? {} : ''
  }

  const now = new Date().getTime()

  return restful ? `?_t=${now}` : { _t: now }
}

/**
 * 将时间对象转换成统一的时间格式
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return
  }

  for (const key in params) {
    if (params[key] && dayjs.isDayjs(params[key])) {
      params[key] = (params[key] as Dayjs).format(DATE_TIME_FORMAT)
    }

    if (params[key] && isString(params[key])) {
      const value = params[key] as string
      params[key] = value.trim()
    }

    //递归
    if (isObject(params[key])) {
      formatRequestDate(params[key])
    }
  }
}
