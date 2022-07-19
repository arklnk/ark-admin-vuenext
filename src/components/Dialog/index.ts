import BasicDialogComp from './src/BasicDialog.vue'
import { withInstall } from '/@/utils'

export const BasicDialog = withInstall(BasicDialogComp)

export { useDialog, useDialogInner } from './src/composables/useDialog'
export * from './src/typing'
