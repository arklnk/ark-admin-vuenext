import BasicFormComp from './src/BasicForm.vue'
import { withInstall } from '/@/utils'

export const BasicForm = withInstall(BasicFormComp)

export { useForm } from './src/composables/useForm'

export { createFormDialog, BasicFormDialog } from './src/functional/createFormDialog'
export { createFormDrawer, BasicFormDrawer } from './src/functional/createFormDrawer'

export * from './src/typing'
