import type { Router } from 'vue-router'

import NProgress from 'nprogress'
import { isEmpty } from 'lodash-es'

import { PageEnum } from '/@/enums/pageEnum'
import { getPageTitle } from '/@/utils'
import { useUserStore } from '/@/stores/modules/user'
import { usePermissionStore } from '/@/stores/modules/permission'

/**
 * @description 白名单路由
 */
export const whitePathList: (PageEnum | string)[] = [PageEnum.Login]

/**
 * setup router guard
 */
export function setupPermissionGuard(router: Router) {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  router.beforeEach(async (to) => {
    // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const curToken = userStore.getToken

    // logged in
    if (!isEmpty(curToken)) {
      if (to.path === PageEnum.Login) {
        // if is logged in, redirect to the home page
        return PageEnum.Root
      } else {
        // check permission route
        const hasRoutes = !isEmpty(permissionStore.getMenuList)

        // access
        if (hasRoutes) {
          return true
        }
      }
    } else {
      // not logged in
      if (whitePathList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        return true
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        return `/login?redirect=${to.path}`
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    NProgress.done()
  })
}
