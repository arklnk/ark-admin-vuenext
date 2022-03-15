import type { Menu, Component } from '/#/vue-router'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'

import { ParentLayout, EmptyLayout } from '/@/router/basicRoutes'
import { isUrl as isExtUrl } from '/@/utils/is'
import { toHump } from '/@/utils'
import { MenuTypeEnum } from '/@/enums/menuEnum'
import { warn } from '/@/utils/log'

import { routeModuleMap } from './routeModule'

/**
 * Filter asynchronous routing tables by recursion
 */
export function filterAsyncRoutes(routes: Menu[], parentRoute: Nullable<Menu>): RouteRecordRaw[] {
  const asyncRoutes: RouteRecordRaw[] = []

  routes.forEach((routeItem) => {
    if (routeItem.type === MenuTypeEnum.Permission) {
      // 权限 或者 隐藏则直接pass
      return
    }

    let realRoute: RouteRecordRaw | null = null
    if (!parentRoute && !routeItem.parentId && routeItem.type === MenuTypeEnum.Menu) {
      // 根菜单
      realRoute = createRouteItem(routeItem, true)
    } else if (!parentRoute && !routeItem.parentId && routeItem.type === MenuTypeEnum.Catalogue) {
      // 目录
      const childRoutes = filterAsyncRoutes(routes, routeItem)
      realRoute = createRouteItem(routeItem, true)
      if (childRoutes && childRoutes.length > 0) {
        realRoute!.redirect = childRoutes[0].path
        realRoute!.children = childRoutes
      }
    } else if (
      parentRoute &&
      parentRoute.id === routeItem.parentId &&
      routeItem.type === MenuTypeEnum.Menu
    ) {
      // 子菜单
      realRoute = createRouteItem(routeItem, false)
    } else if (
      parentRoute &&
      parentRoute.id === routeItem.parentId &&
      routeItem.type === MenuTypeEnum.Catalogue
    ) {
      // 如果还是目录，继续递归
      const childRoute = filterAsyncRoutes(routes, routeItem)
      realRoute = createRouteItem(routeItem, false)
      if (childRoute && childRoute.length > 0) {
        realRoute!.redirect = childRoute[0].path
        realRoute!.children = childRoute
      }
    }

    // add item
    if (realRoute) {
      asyncRoutes.push(realRoute)
    }
  })

  return asyncRoutes
}

/**
 * create real route raw obj
 */
export function createRouteItem(menu: Menu, isRoot: boolean): RouteRecordRaw | null {
  // route name
  const name = toHump(menu.router)
  const meta: RouteMeta = {
    title: menu.name,
    icon: menu.icon,
    hidden: !menu.isShow,
    noCache: !menu.keepalive,
  }
  // dir
  if (menu.type === 0) {
    return {
      name,
      path: menu.router,
      component: isRoot ? ParentLayout : EmptyLayout,
      meta,
    }
  }
  // external link
  if (isExtUrl(menu.router)) {
    return {
      name,
      path: `external-link${menu.id}`,
      component: ParentLayout,
      children: [
        {
          path: menu.router,
          component: EmptyLayout,
          meta,
        },
      ],
    }
  }
  // menu
  const comp = routeModuleMap[menu.viewPath]
  if (!comp) {
    warn('未定义的视图 ' + menu.viewPath + ', 请自行创建并在router/modules文件夹中建立关联!')
    return null
  }

  if (isRoot) {
    return {
      name,
      path: menu.router,
      redirect: `${menu.router}/index`,
      component: ParentLayout,
      children: [
        {
          path: 'index',
          component: comp,
          meta,
        },
      ],
    }
  }

  // 2级、3级以上嵌套菜单
  return {
    name,
    path: menu.router,
    component: comp,
    meta,
  }
}

/**
 * ts
 */
export function defineRouteModule(module: Record<string, Component>) {
  return module
}
