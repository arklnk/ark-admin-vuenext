import type { Menu } from '/#/vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { ParentLayout, EmptyLayout } from '/@/router/basicRoutes'
import { isUrl } from '/@/utils/is'
import { routeModuleMap } from '/@/router/asyncRoutes'

/**
 * create real route raw obj
 */
export function createRouteItem(menu: Menu, isRoot: boolean): RouteRecordRaw | null {
  // dir
  if (menu.type === 0) {
    return {
      path: menu.router,
      component: isRoot ? ParentLayout : EmptyLayout,
      meta: {
        title: menu.name,
        icon: menu.icon,
      },
    }
  }
  // external link
  if (isUrl(menu.router)) {
    return {
      path: `external-link${menu.id}`,
      component: ParentLayout,
      children: [
        {
          path: menu.router,
          component: EmptyLayout,
          meta: {
            title: menu.name,
            icon: menu.icon,
          },
        },
      ],
    }
  }
  // menu
  const comp = routeModuleMap[menu.viewPath]
  if (!comp) return null

  if (isRoot) {
    return {
      path: menu.router,
      redirect: `${menu.router}/index`,
      component: ParentLayout,
      children: [
        {
          path: 'index',
          component: comp,
          meta: {
            title: menu.name,
            icon: menu.icon,
            noCache: !menu.keepalive,
          },
        },
      ],
    }
  }

  return null
}
