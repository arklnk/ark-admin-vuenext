import type { Router } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { isEmpty } from 'lodash-es'

import { PageEnum } from '/@/enums/pageEnum'
import { getPageTitle } from '/@/utils'
import { useUserStore } from '/@/stores/modules/user'
import { usePermissionStore } from '/@/stores/modules/permission'
import { error } from '/@/utils/log'
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting'

/**
 * @description 白名单路由
 */
export const whitePathList: (PageEnum | string)[] = [PageEnum.Login]

/**
 * setup router guard
 */
export function setupPermissionGuard(router: Router) {
  NProgress.configure({ showSpinner: false })

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const { getEnableNProgress } = useTransitionSetting()

  router.beforeEach(async (to, _from) => {
    // start progress bar
    if (getEnableNProgress.value) {
      NProgress.start()
    }

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
        } else if (!hasRoutes && permissionStore.getIsDynamicAddedRoute) {
          // 如果该用户没有权限路由，则重定向至 403
          // fixed Detected an infinite redirection in a navigation guard
          return to.path === PageEnum.Forbidden ? true : PageEnum.Forbidden
        } else {
          // config permission and menu
          try {
            const [menus, _] = await Promise.all([
              permissionStore.buildPermAndMenu(),
              userStore.initUserInfo(),
            ])
            // dynamic add route
            menus.forEach(router.addRoute)
            // is added
            permissionStore.setDynamicAddedRoute(true)
            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            return { ...to, replace: true }
          } catch (e) {
            error(`${e}`)
            // remove token
            userStore.resetState()
            permissionStore.resetState()

            return `${PageEnum.Login}?redirect=${encodeURIComponent(to.fullPath)}`
          }
        }
      }
    } else {
      // not logged in
      if (whitePathList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        return true
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        return `${PageEnum.Login}?redirect=${encodeURIComponent(to.fullPath)}`
      }
    }
  })

  router.afterEach((to) => {
    // set page title
    document.title = getPageTitle(to.meta.title)

    // finish progress bar
    if (NProgress.isStarted()) {
      NProgress.done()
    }
  })
}
