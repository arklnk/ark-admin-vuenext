import type { Menu } from '/#/vue-router'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'

import { EmptyLayout, IFrameLayout, ParentLayout } from '/@/router/contants'
import { isUrl as isExtUrl } from '/@/utils/is'
import { IframePrefix, MenuTypeEnum } from '/@/enums/menuEnum'
import { warn } from '/@/utils/log'

import { backModuleMap } from '../routes/'

/**
 * Filter asynchronous routing tables by recursion
 */
export function transformMenuToRoute(
  routes: Menu[],
  parentRoute: Nullable<Menu>
): RouteRecordRaw[] {
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
      const childRoutes = transformMenuToRoute(routes, routeItem)
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
      const childRoute = transformMenuToRoute(routes, routeItem)
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
  const name = `Route${menu.id}`

  // route meta
  const meta: RouteMeta = {
    title: menu.name,
    icon: menu.icon,
    hidden: !menu.isShow,
    noCache: !menu.keepalive,
  }

  // 目录级别
  if (menu.type === 0) {
    return {
      name,
      path: menu.router,
      component: isRoot ? ParentLayout : EmptyLayout,
      meta,
    }
  }

  // 内嵌iframe
  if (menu.router.startsWith(IframePrefix)) {
    meta.iframeSrc = menu.router.substring(IframePrefix.length, menu.router.length)
    const path = `/iframe/${menu.id}`
    return isRoot
      ? {
          name,
          path,
          component: ParentLayout,
          redirect: `${path}/index`,
          children: [
            {
              path: `${path}/index`,
              component: IFrameLayout,
              meta,
            },
          ],
        }
      : {
          name,
          path,
          component: IFrameLayout,
          meta,
        }
  }

  // 外链
  if (isExtUrl(menu.router)) {
    return {
      name,
      path: menu.router,
      redirect: menu.router,
      meta,
    }
  }

  // 内嵌视图菜单
  const comp = backModuleMap[menu.viewPath]
  if (!comp) {
    warn('未定义的视图' + menu.viewPath + ',请自行创建模块建立关联!')
    return null
  }

  // 根级别节点需要嵌套ParentLayout
  return isRoot
    ? {
        name,
        path: menu.router,
        component: ParentLayout,
        redirect: `${menu.router}/index`,
        children: [
          {
            path: `${menu.router}/index`,
            component: comp,
            meta,
          },
        ],
      }
    : {
        name,
        path: menu.router,
        component: comp,
        meta,
      }
}
