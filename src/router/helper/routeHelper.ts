import type { Component, Menu } from '/#/vue-router'

import { EmptyLayout, IFrameLayout, ParentLayout } from '../contants'
import { RouteRecordRaw } from 'vue-router'
import { warn } from '/@/utils/log'
import { MenuTypeEnum } from '/@/enums/menuEnum'

export type LayoutMapKey = 'LAYOUT'

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>()

LayoutMap.set('LAYOUT', ParentLayout)
LayoutMap.set('IFRAME', IFrameLayout)

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

export function dynamicImport(component: string): Component {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/index.{vue,tsx}')

  const keys = Object.keys(dynamicViewsModules)

  const matchKeys = keys.filter((key) => {
    // support sf-vue-admin: views/system/permission/menu,
    // but vuenext view path: views/system/permission/menu/index.vue | index.tsx
    const k = key.replace('../../', '')
    const startFlag = component.startsWith('/')
    const endFlag = component.endsWith('index.vue') || component.endsWith('index.tsx')
    const startIndex = startFlag ? 0 : 1
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.') - 5
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
    warn(`在src/views/${component}找不到指定的文件,请自行创建!`)
    return
  }
}

/**
 * transform back menu object to route
 */
export function transformMenuToRoute(menus: Menu[], isRoot = false): RouteRecordRaw[] {
  return menus.map((menu) => {
    // 根菜单则需要多一层ParentLayout包裹
    if (isRoot && menu.type === MenuTypeEnum.Menu) {
    }
    return {
      path: menu.router,
      component: isRoot ? ParentLayout : EmptyLayout,
    }
  })
}
