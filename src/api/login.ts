import { defHttp } from '../utils/http/axios'

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
export function getImageCaptcha(params?: CaptchaImgParams) {
  return defHttp.get<CaptchaImgResult>({ url: Api.captcha, params }, { errorMessageMode: 'none' })
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
export function userLogin(data: UserLoginParams): Promise<Nullable<UserLoginResult>> {
  return defHttp.post<Nullable<UserLoginResult>>(
    { url: Api.login, data },
    { errorMessageMode: 'message' }
  )
}
