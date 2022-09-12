import BasicDrawerComp from './src/BasicDrawer.vue'
import { withInstall } from '/@/utils'

export const BasicDrawer = withInstall(BasicDrawerComp)

export { useDrawer, useDrawerInner } from './src/composables/useDrawer'

export * from './src/typing'
