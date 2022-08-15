import { defHttp } from '/@/utils/http/axios'
import type { Menu } from '/@/router/typing'

export const Api = {
  login: '/user/login',
  captcha: '/user/login/captcha',
  info: '/user/info',
  permmenu: '/user/permmenu',
  logout: '/user/logout',
}

interface CaptchaImgParams {
  width?: number
  height?: number
}
interface CaptchaImgResult {
  verifyCode: string
  captchaId: string
}
export function getImageCaptcha(params?: CaptchaImgParams) {
  return defHttp.get<CaptchaImgResult>({ url: Api.captcha, params }, { errorMessageMode: 'none' })
}

interface UserLoginParams {
  account: string
  password: string
  captchaId: string
  verifyCode: string
}
interface UserLoginResult {
  token: string
}
export function userLogin(data: UserLoginParams): Promise<Nullable<UserLoginResult>> {
  return defHttp.post<Nullable<UserLoginResult>>(
    { url: Api.login, data },
    { errorMessageMode: 'message' }
  )
}

interface UserInfoResult {
  username: string
  avatar: string
}
export function getUserInfo(): Promise<UserInfoResult> {
  return defHttp.get<UserInfoResult>({ url: Api.info })
}

interface PermMenuResult {
  perms: string[]
  menus: Menu[]
}
export function getPermAndMenu(): Promise<PermMenuResult> {
  return defHttp.get<PermMenuResult>({ url: Api.permmenu })
}

export function userLogout(): Promise<void> {
  return defHttp.post<void>({ url: Api.logout })
}
