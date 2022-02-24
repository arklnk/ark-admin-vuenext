import type { RouteRecordRaw } from 'vue-router'

import { defineStore } from 'pinia'

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
    setPermissionList(perms: string[]) {
      this.permissionList = perms
    },
    async generateRoutes(): Promise<RouteRecordRaw[]> {
      return []
    },
  },
})
