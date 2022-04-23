import type { Router } from 'vue-router'
import projectSetting from '/@/settings/projectSetting'

export function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = projectSetting

  router.beforeEach(() => {
    return true
  })
}
