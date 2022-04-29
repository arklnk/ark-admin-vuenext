import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import type { Menu } from '/#/vue-router'

import { defineStore } from 'pinia'
import { getPermAndMenu } from '/@/api/account'
import { useAppStore } from './app'
import projectSetting from '/@/settings/projectSetting'
import { PermissionModeEnum } from '/@/enums/appEnum'
import { useUserStore } from './user'
import { toRaw } from 'vue'
import { filter, listToTree } from '/@/utils/helper/tree'
import { roleRoutes } from '/@/router/routes'
import { MenuTypeEnum } from '/@/enums/menuEnum'
import { transformMenuToRoute } from '/@/router/helper/routeHelper'

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

      const roleRouteFilter = (route: RouteRecordRaw): boolean => {
        const { meta } = route
        const { roles } = meta || ({} as RouteMeta)

        if (!roles) {
          return true
        }

        return roleList.some((role) => roles.includes(role))
      }

      const menuFilter = (menu: Menu): boolean => {
        return menu.type !== MenuTypeEnum.Permission
      }

      // 判断权限路由模式
      switch (permissionMode) {
        // 后端路由模式
        case PermissionModeEnum.BACK:
          const { menus, perms } = await getPermAndMenu()
          // 过滤权限
          let menusTree = filter(menus, menuFilter)

          // 转换成真实的vue-router对象
          menusTree = listToTree(menus)
          routes = transformMenuToRoute(menusTree)

          // 按钮级别权限数据
          this.setPermissionList(perms || [])
          // routes = result
          break
        // 角色路由模式
        case PermissionModeEnum.ROLE:
          routes = filter(roleRoutes, roleRouteFilter)
          break
      }

      // store
      this.setMenuList(routes)
      return routes
    },
  },
})
