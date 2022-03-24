import type { Router, RouteLocationRaw } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { isEmpty } from 'lodash-es'

import { NotFoundRouteName, PageEnum, ParentRouteName } from '/@/enums/pageEnum'
import { getPageTitle } from '/@/utils'
import { useUserStore } from '/@/stores/modules/user'
import { usePermissionStore } from '/@/stores/modules/permission'
import { NotFoundRoute } from '../basicRoutes'
import { error } from '/@/utils/log'

/**
 * @description 白名单路由
 */
export const whitePathList: (PageEnum | string)[] = [PageEnum.Login]

function generateLoginPath(toPath: string): RouteLocationRaw {
  return {
    path: toPath === PageEnum.NotFound ? PageEnum.Login : `${PageEnum.Login}?redirect=${toPath}`,
    replace: true,
  }
}

/**
 * setup router guard
 */
export function setupPermissionGuard(router: Router) {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  router.beforeEach(async (to, _from) => {
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
            menus.forEach((m) => router.addRoute(ParentRouteName, m))
            // add notfound
            router.addRoute(NotFoundRouteName, NotFoundRoute)
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

            return generateLoginPath(to.path)
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
        return generateLoginPath(to.path)
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    NProgress.done()
  })
}
