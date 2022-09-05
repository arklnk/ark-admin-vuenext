import type { App, AppContext } from 'vue'
import ElementPlus from 'element-plus'

export let globalAppContext: AppContext

export function registerGlobalComp(app: App<Element>) {
  // element-plus
  app.use(ElementPlus)

  // global app context
  globalAppContext = app._context
}
