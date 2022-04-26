import type { RouteRecordRaw } from 'vue-router'

import { defineStore } from 'pinia'
import { getPermAndMenu } from '/@/api/account'
import { filterAsyncRoutes } from '/@/router/helper/routeHelper'

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
    /**
     * @description 获取登录管理员权限和菜单配置
     */
    async buildRoutesAction(): Promise<RouteRecordRaw[]> {
      const { menus: menusList, perms } = await getPermAndMenu()
      // 过滤菜单数据
      const menus = filterAsyncRoutes(menusList, null)
      // setter
      this.permissionList = perms
      this.menuList = menus
      return menus
    },
  },
})
