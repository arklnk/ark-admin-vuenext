import type { RouteMeta, RouteRecordRaw } from 'vue-router'

import { defineStore } from 'pinia'
import { getPermAndMenu } from '/@/api/account'
import { transformMenuToRoute } from '/@/router/helper/backHelper'
import { useAppStore } from './app'
import projectSetting from '/@/settings/projectSetting'
import { PermissionModeEnum } from '/@/enums/appEnum'
import { useUserStore } from './user'
import { toRaw } from 'vue'
import { filter } from '/@/utils/helper'
import { roleRoutes } from '/@/router/routes'

interface PermissionState {
  /**
   * @description dynamic route
   */
  menuList: RouteRecordRaw[]

  /**
   * @description like this [ 'sys:user:add', 'sys:user:update' ]
   */
  permissionList: string[]

  /**
   * Whether the route has been dynamically added
   */
  isDynamicAddedRoute: boolean
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => {
    return {
      isDynamicAddedRoute: false,
      menuList: [],
      permissionList: [],
    }
  },
  getters: {
    getMenuList(): RouteRecordRaw[] {
      return this.menuList
    },
    getPermissionList(): string[] {
      return this.permissionList
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute
    },
  },
  actions: {
    resetState(): void {
      this.menuList = []
      this.permissionList = []
      this.isDynamicAddedRoute = false
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    setPermissionList(list: string[]) {
      this.permissionList = list
    },
    setMenuList(routes: RouteRecordRaw[]) {
      this.menuList = routes
    },
    /**
     * @description 获取登录管理员权限和菜单配置
     */
    async buildRoutesAction(): Promise<RouteRecordRaw[]> {
      const appStore = useAppStore()
      const userStore = useUserStore()

      let routes: RouteRecordRaw[] = []
      const roleList = toRaw(userStore.getRoleList) || []
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig

      const routeFilter = (route: RouteRecordRaw): boolean => {
        const { meta } = route
        const { roles } = meta || ({} as RouteMeta)

        if (!roles) {
          return true
        }

        return roleList.some((role) => roles.includes(role))
      }

      // 判断权限路由模式
      switch (permissionMode) {
        // 后端路由模式
        case PermissionModeEnum.BACK:
          const { menus: menusList, perms } = await getPermAndMenu()
          const menus = transformMenuToRoute(menusList, null)

          // 按钮级别权限数据
          this.setPermissionList(perms || [])
          routes = menus
          break
        // 角色路由模式
        case PermissionModeEnum.ROLE:
          routes = filter(roleRoutes, routeFilter)
          break
      }

      console.log(routes)

      this.setMenuList(routes)
      return routes
    },
  },
})
