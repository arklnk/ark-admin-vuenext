import type { App, AppContext } from 'vue'
import ElementPlus from 'element-plus'

import SvgIcon from '/@/components/Icon'

export let globalAppContext: AppContext | null = null

export function registerGlobalComp(app: App<Element>) {
  // element-plus
  app.use(ElementPlus)
  // svg icon
  app.use(SvgIcon)

  // global app context
  globalAppContext = app._context
}
