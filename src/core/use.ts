import type { App } from 'vue'
import ElementPlus from 'element-plus'

export function registerPlugin(app: App<Element>) {
  // element-plus
  app.use(ElementPlus)
}
