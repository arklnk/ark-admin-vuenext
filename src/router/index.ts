import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { basicRoutes } from '/@/router/basicRoutes'
import { setupPermissionGuard } from '/@/router/permissionGuard'

export const router = createRouter({
  history: createWebHistory(),
  routes: basicRoutes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function setupRouter(app: App<Element>) {
  app.use(router)

  // router guard
  setupPermissionGuard(router)
}
