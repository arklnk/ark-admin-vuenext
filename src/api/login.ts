import request from '/@/utils/request'

export enum Api {
  login = 'login',
  captcha = 'captcha/img'
}

export const login = () => {
  return request({
    url: Api.login,
    method: 'POST',
  })
}

export const getImageCaptcha = () => {
  return request({
    url: Api.captcha,
    method: 'GET'
  })
}
