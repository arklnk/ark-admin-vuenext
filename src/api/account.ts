import type { BaseResultPromise } from '/#/request'
import request from '/@/utils/request'

enum Api {
  info = 'account/info',
  permmenu = 'account/permmenu',
}

export function getAccountInfo(): BaseResultPromise {
  return request({
    url: Api.info,
    method: 'GET',
  })
}

export function getPermAndMenu(): BaseResultPromise {
  return request({
    url: Api.permmenu,
    method: 'GET',
  })
}
