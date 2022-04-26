import type { Router } from 'vue-router'

import projectSetting from '/@/settings/projectSetting'
import { AxiosCanceler } from '/@/utils/http/axios/axiosCanceler'

export function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = projectSetting

  let axiosCanceler: Nullable<AxiosCanceler>

  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler()
  }

  router.beforeEach(() => {
    // 切换路由将删除所有的请求
    axiosCanceler?.removeAllPending()
    return true
  })
}
