import type { Router } from 'vue-router'
import { getPageTitle } from '/@/utils'

export function createPageTitleGuard(router: Router) {
  router.afterEach((to) => {
    document.title = getPageTitle(to.meta?.title)
  })
}
