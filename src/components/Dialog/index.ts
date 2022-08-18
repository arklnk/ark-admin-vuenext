import BasicDialogComp from './src/BasicDialog.vue'
import { withInstall } from '/@/utils'

export const BasicDialog = withInstall(BasicDialogComp)

export { useDialogContext } from './src/composables/useDialogContext'
export { useDialog, useDialogInner } from './src/composables/useDialog'
export * from './src/typing'
