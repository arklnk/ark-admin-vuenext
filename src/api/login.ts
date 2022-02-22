import type { BaseResultPromise } from '/#/request'
import request from '/@/utils/request'

export enum Api {
  login = 'login',
  captcha = 'captcha/img',
}

interface CaptchaImgParams {
  width?: number
  height?: number
}
interface CaptchaImgResult {
  img: string
  id: string
}
export function getImageCaptcha(params?: CaptchaImgParams): BaseResultPromise<CaptchaImgResult> {
  return request({
    url: Api.captcha,
    method: 'GET',
    params,
  })
}

interface UserLoginParams {
  username: string
  password: string
  captchaId: string
  verifyCode: string
}
interface UserLoginResult {
  token: string
}
export function userLogin(data: UserLoginParams): BaseResultPromise<null | UserLoginResult> {
  return request({
    url: Api.login,
    method: 'POST',
    data,
  })
}
