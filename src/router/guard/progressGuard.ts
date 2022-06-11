import type { Router } from 'vue-router'

import NProgress from 'nprogress'
import { useTransitionSetting } from '/@/composables/setting/useTransitionSetting'
import { unref } from 'vue'

export function createProgressGuard(router: Router) {
  const { getEnableNProgress } = useTransitionSetting()
  NProgress.configure({ showSpinner: false })

  router.beforeEach(() => {
    unref(getEnableNProgress) && NProgress.start()
    return true
  })

  router.afterEach(() => {
    unref(getEnableNProgress) && NProgress.done()
    return true
  })
}
