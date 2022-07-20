import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import type { Menu } from '/@/router/typing'

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
import { warn } from '/@/utils/log'
import { isUrl } from '/@/utils/is'

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

      // 角色路由过滤
      const roleRouteFilter = (route: RouteRecordRaw): boolean => {
        const { meta } = route
        const { roles } = meta || ({} as RouteMeta)

        if (!roles) {
          return true
        }

        return roleList.some((role) => roles.includes(role))
      }

      const backRouteFilter = (menu: Menu): boolean => {
        if (menu.type === MenuTypeEnum.Permission) {
          return false
        }

        if (!menu.router?.startsWith('/') && !isUrl(menu.router)) {
          warn(`此路由${menu.router}不合法，需以/或者合法的url开头。`)
          return false
        }

        return true
      }

      // 判断权限路由模式
      switch (permissionMode) {
        // 后端路由模式
        case PermissionModeEnum.BACK:
          const { menus, perms } = await getPermAndMenu()
          // 过滤权限
          let menusTree = filter(menus, backRouteFilter)

          // 转换成真实的vue-router对象
          menusTree = listToTree(menusTree, { pid: 'parentId' })
          routes = transformMenuToRoute(menusTree, true)

          // 按钮级别权限数据
          this.setPermissionList(perms || [])
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
