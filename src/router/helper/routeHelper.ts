import type { Component, Menu } from '/#/vue-router'

import { EmptyLayout, IFrameLayout, ParentLayout, ViewNotFound } from '../contants'
import { RouteMeta, RouteRecordRaw } from 'vue-router'
import { warn } from '/@/utils/log'
import { IframePrefix, MenuTypeEnum } from '/@/enums/menuEnum'
import { isUrl } from '/@/utils/is'
// import qs from 'qs'

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

export function dynamicImport(component?: string): Component {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/index.{vue,tsx}')

  const keys = Object.keys(dynamicViewsModules)

  if (!component) {
    return ViewNotFound
  }

  const matchKeys = keys.filter((key) => {
    // support sf-vue-admin: views/system/permission/menu,
    // but vuenext view path: views/system/permission/menu/index.vue | index.tsx
    const k = key.replace('../../', '')
    const startFlag = component.startsWith('/')
    const endFlag = component.endsWith('/index.vue') || component.endsWith('/index.tsx')
    const startIndex = startFlag ? 1 : 0
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.') - 6 // remove /index
    return k.substring(startIndex, lastIndex) === component
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
    return ViewNotFound
  }
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
      noCache: !menu.keepalive,
    }

    // 目录
    if (menu.type === MenuTypeEnum.Catalogue) {
      const route: RouteRecordRaw = {
        name: menu.router,
        path: menu.router,
        component: isRoot ? ParentLayout : EmptyLayout,
        meta,
      }

      if (menu.children && menu.children.length > 0) {
        route.children = transformMenuToRoute(menu.children)
        // 目录时则尝试重定向至默认首个子项路径
        route.redirect = route.children[0].path
      }
      return route
    }

    // 外链
    if (isUrl(menu.router)) {
      // const query = qs.parse(menu.router, { ignoreQueryPrefix: true })
      // if (Reflect.has(query, '__iframe__')) {

      // }

      return {
        path: `/external-link/${menu.id}`,
        name: menu.router,
        redirect: menu.router,
        meta,
      }
    }

    // 内嵌页面
    let component: Component | null = null
    let path = menu.router
    if (menu.router.startsWith(IframePrefix)) {
      path = `/iframe/${menu.id}`
      meta.iframeSrc = menu.router.substring(IframePrefix.length, menu.router.length)
      component = IFrameLayout
    } else {
      component = dynamicImport(menu.viewPath)
    }

    if (isRoot) {
      // 需要ParentLayout包裹
      return {
        path,
        name: menu.router,
        component: ParentLayout,
        redirect: `${path}/index`,
        meta: {
          single: true,
        },
        children: [
          {
            path: `${path}/index`,
            component,
            meta,
          },
        ],
      }
    } else {
      return {
        path,
        name: menu.router,
        component,
        meta,
      }
    }
  })
}
