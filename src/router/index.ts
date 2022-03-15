import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { basicRoutes } from '/@/router/basicRoutes'
import { setupPermissionGuard } from '/@/router/permissionGuard'

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = []
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
getRouteNames(basicRoutes)

export const router = createRouter({
  history: createWebHistory(),
  routes: basicRoutes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {}

export function setupRouter(app: App<Element>) {
  app.use(router)

  // router guard
  setupPermissionGuard(router)
}
