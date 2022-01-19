import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [],
  strict: true
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}