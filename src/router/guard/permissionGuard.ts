import type { Router } from 'vue-router'

import { PageEnum } from '/@/enums/pageEnum'
import { useUserStore } from '/@/stores/modules/user'
import { usePermissionStore } from '/@/stores/modules/permission'
import { NotFoundRoute } from '../routes/basic'

/**
 * @description 白名单路由
 */
export const whitePathList: (PageEnum | string)[] = [PageEnum.Login]

export function createPermissionGuard(router: Router) {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  router.beforeEach(async (to, from) => {
    const token = userStore.getToken

    // 白名单
    if (whitePathList.includes(to.path)) {
      if (to.path === PageEnum.Login && token) {
        return (to.query?.redirect as string) || PageEnum.Root
      }
      return true
    }

    // token不存在
    if (!token) {
      return {
        path: PageEnum.Login,
        replace: true,
        query: {
          redirect: to.path,
        },
      }
    }

    try {
      // 判断是否需要初始化用户信息
      if (!userStore.getUserInfo) {
        await userStore.getUserInfoAction()
      }

      // 如果权限路由已初始化
      if (permissionStore.getIsDynamicAddedRoute) {
        return true
      }

      // 初始化权限路由
      const routes = await permissionStore.buildRoutesAction()
      routes.forEach((route) => {
        router.addRoute(route)
      })

      // dynamic route is added
      permissionStore.setDynamicAddedRoute(true)

      if (to.name === NotFoundRoute.name) {
        // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
        return { path: to.fullPath, replace: true, query: to.query }
      } else {
        const redirectPath = (from.query.redirect || to.path) as string
        const redirect = decodeURIComponent(redirectPath)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        return nextData
      }
    } catch (e) {
      // clear userinfo, need relogin
      userStore.resetState()

      return {
        path: PageEnum.Login,
        query: {
          redirect: encodeURIComponent(to.fullPath),
        },
        replace: true,
      }
    }
  })
}
