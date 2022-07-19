import { defHttp } from '../utils/http/axios'
import type { Menu } from '/@/router/typing'

enum Api {
  info = 'account/info',
  permmenu = 'account/permmenu',
  logout = 'account/logout',
}

interface AccountInfoResult {
  name: string
  nickName: string
  email: string
  phone: string
  remark: string
  headImg: string
}
export function getAccountInfo(): Promise<AccountInfoResult> {
  return defHttp.get<AccountInfoResult>({ url: Api.info })
}

interface PermMenuResult {
  perms: string[]
  menus: Menu[]
}
export function getPermAndMenu(): Promise<PermMenuResult> {
  return defHttp.get<PermMenuResult>({ url: Api.permmenu })
}

export function logout(): Promise<void> {
  return defHttp.post<void>({ url: Api.logout })
}
