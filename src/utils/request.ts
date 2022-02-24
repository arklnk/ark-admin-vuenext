import axios from 'axios'
import { ElMessage } from 'element-plus'

import { ResultEnum } from '/@/enums/httpEnum'
import { ExceptionEnum } from '/@/enums/exceptionEnum'
import { Api } from '/@/api/login'

import type { SFAxiosInstance, BaseResult } from '/#/request'
import { useUserStore } from '/@/stores/modules/user'

/**
 * @description axios instance
 */
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
}) as unknown as SFAxiosInstance

/**
 * request interceptor (token)
 */
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    // set user token in header
    if (userStore.getToken) {
      config.headers!['Authorization'] = userStore.getToken
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * response interceptor
 */
instance.interceptors.response.use(
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res: BaseResult = response.data

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== ResultEnum.SUCCESS) {
      // if not captcha api path, notify message
      if (response.config.url !== Api.captcha) {
        ElMessage({
          type: 'error',
          message: res.message,
          duration: 5 * 1000,
        })
      }

      // Illgal token
      if (res.code === ExceptionEnum.TOKEN_EXPIRE || res.code === ExceptionEnum.TOKEN_INVALID) {
        // sign out to re login
      }
    }
    return res
  }
)

export default instance
