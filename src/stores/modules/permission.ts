import type { RouteRecordRaw } from 'vue-router'

import { defineStore } from 'pinia'
import { getPermAndMenu } from '/@/api/account'
import { filterAsyncRoutes } from '/@/router/routeHelper'

interface PermissionState {
  /**
   * @description dynamic route
   */
  menuList: RouteRecordRaw[]

  /**
   * @description like this [ 'sys:user:add', 'sys:user:update' ]
   */
  permissionList: string[]
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => {
    return {
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
  },
  actions: {
    resetPermAndMenu() {
      this.menuList = []
      this.permissionList = []
    },
    /**
     * @description 获取登录管理员权限和菜单配置
     */
    async getPermAndMenu(): Promise<RouteRecordRaw[]> {
      const { data } = await getPermAndMenu()
      this.permissionList = data!.perms
      // 过滤菜单数据
      const menus = filterAsyncRoutes(data!.menus, null)
      return menus
    },
  },
})
