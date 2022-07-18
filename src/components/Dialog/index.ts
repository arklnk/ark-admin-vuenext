import BasicDialogComp from './src/BasicDialog.vue'
import { withInstall } from '/@/utils'

export const BasicDialog = withInstall(BasicDialogComp)

export { useDialog } from './src/composables/useDialog'
