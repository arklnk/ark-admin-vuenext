import type { Component, Menu } from '/#/vue-router'

import { EmptyLayout, IFrameLayout, ParentLayout } from '../contants'
import { RouteRecordRaw } from 'vue-router'

export type LayoutMapKey = 'LAYOUT'

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>()

LayoutMap.set('LAYOUT', ParentLayout)
LayoutMap.set('IFRAME', IFrameLayout)

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

export function dynamicImport(view: Nullable<string>): Component {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}')

  const keys = Object.keys(dynamicViewsModules)
  console.log(keys)

  if (!view) {
    return
  }
}

/**
 * transform back menu object to route
 */
export function transformMenuToRoute(menus: Menu[], isRoot = false): RouteRecordRaw[] {
  return menus.map((menu) => {
    return {
      path: menu.router,
      component: isRoot ? ParentLayout : EmptyLayout,
    }
  })
}
