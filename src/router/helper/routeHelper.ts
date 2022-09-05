import type { Menu, Component } from '../typing'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'

import { EmptyLayout, IFrameLayout, ParentLayout, ExceptionComponent } from '../contants'
import { warn } from '/@/utils/log'
import { MenuTypeEnum } from '/@/enums/menuEnum'
import { isUrl } from '/@/utils/is'

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

function parseDynamicImportPath(key: string): string {
  const k = key.replace('../../', '')
  // const startFlag = component.startsWith('/')
  // const endFlag = component.endsWith('/index.vue') || component.endsWith('/index.tsx')
  // remove /index view name
  const lastIndex = k.lastIndexOf('.') - 6
  return k.substring(0, lastIndex)
}

export function dynamicImport(component?: string): Component {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/index.{vue,tsx}')

  const keys = Object.keys(dynamicViewsModules)

  if (!component) {
    return ExceptionComponent
  }

  const matchKeys = keys.filter((key) => {
    return parseDynamicImportPath(key) === component
  })

  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return dynamicViewsModules[matchKey]
  } else if (matchKeys?.length > 1) {
    warn(
      '请不要在views文件夹下创建相同层次目录中具有相同文件名的文件index.vue和index.tsx,这将导致动态引入失败'
    )
    return
  } else {
    warn(`在src/${component}找不到指定的文件,请自行创建!`)
    return ExceptionComponent
  }
}

/**
 * get all dynamic import view list
 */
export function getDynamicImportViews(): string[] {
  if (!dynamicViewsModules) return []

  return Object.keys(dynamicViewsModules).map((key) => parseDynamicImportPath(key))
}

/**
 * transform back menu object to route
 */
export function transformMenuToRoute(menus: Menu[], isRoot = false): RouteRecordRaw[] {
  return menus.map((menu): RouteRecordRaw => {
    const meta: RouteMeta = {
      title: menu.name,
      icon: menu.icon,
      hidden: !menu.isShow,
    }

    // 目录
    if (menu.type === MenuTypeEnum.Catalogue) {
      const route: RouteRecordRaw = {
        name: menu.router,
        path: menu.router,
        component: isRoot ? ParentLayout : EmptyLayout,
        meta,
        children: [],
      }

      if (menu.children && menu.children.length > 0) {
        route.children = transformMenuToRoute(menu.children)
        // 目录时则尝试重定向至默认首个子项路径
        route.redirect = route.children[0].path
      } else {
        // invalid catalogue, will ignore
        route.meta!.ignoreRoute = true
      }
      return route
    }

    // 外链
    if (isUrl(menu.router)) {
      return {
        path: `/external-link/${menu.id}`,
        name: menu.router,
        component: ParentLayout,
        meta: {
          single: true,
        },
        children: [
          {
            path: menu.router,
            component: ParentLayout,
            meta,
          },
        ],
      }
    }

    // 内嵌页面
    let component: Component

    if (isUrl(menu.viewPath || '')) {
      meta.iframeSrc = menu.viewPath
      component = IFrameLayout
    } else {
      component = dynamicImport(menu.viewPath)
    }

    if (isRoot) {
      // 需要ParentLayout包裹
      return {
        path: menu.router,
        name: menu.router,
        component: ParentLayout,
        redirect: `${menu.router}/index`,
        meta: {
          single: true,
        },
        children: [
          {
            path: `${menu.router}/index`,
            component,
            meta,
          },
        ],
      }
    } else {
      return {
        path: menu.router,
        name: menu.router,
        component,
        meta,
      }
    }
  })
}
