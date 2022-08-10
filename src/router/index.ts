import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { basicRoutes } from './routes/basic'

/**
 * 白名单应该包含基本静态路由
 */
const WHITE_NAME_LIST: string[] = []
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    if (item.name) {
      WHITE_NAME_LIST.push(item.name)
    }
    getRouteNames(item.children || [])
  })
getRouteNames([...basicRoutes])

export const router = createRouter({
  history: createWebHistory(),
  routes: basicRoutes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      if (router.hasRoute(name)) router.removeRoute(name)
    }
  })
}

export async function setupRouter(app: App<Element>) {
  app.use(router)
}
