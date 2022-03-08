import type { App } from 'vue'
import ElementPlus from 'element-plus'

import { SvgIcon } from '/@/components/Icon'

export function registerGlobalComp(app: App<Element>) {
  // element-plus
  app.use(ElementPlus)
  // svg icon
  app.use(SvgIcon)
}
