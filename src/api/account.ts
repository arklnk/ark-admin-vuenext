import type { BaseResultPromise } from '/#/request'
import type { Menu } from '/#/vue-router'

import request from '/@/utils/request'

enum Api {
  info = 'account/info',
  permmenu = 'account/permmenu',
  logout = '/account/logout',
}

interface AccountInfoResult {
  name: string
  nickName: string
  email: string
  phone: string
  remark: string
  headImg: string
}
export function getAccountInfo(): BaseResultPromise<AccountInfoResult> {
  return request({
    url: Api.info,
    method: 'GET',
  })
}

interface PermMenuResult {
  perms: string[]
  menus: Menu[]
}
export function getPermAndMenu(): BaseResultPromise<PermMenuResult> {
  return request({
    url: Api.permmenu,
    method: 'GET',
  })
}

export function logout(): BaseResultPromise {
  return request({
    url: Api.logout,
    method: 'POST',
  })
}
