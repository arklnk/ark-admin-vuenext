import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import Layout from '/@/layout/index.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout
    }
  ],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}