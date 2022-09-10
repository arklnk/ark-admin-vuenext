import BasicFormComp from './src/BasicForm.vue'
import { withInstall } from '/@/utils'

export const BasicForm = withInstall(BasicFormComp)

export { useForm } from './src/composables/useForm'

export { createFormDialog } from './src/functional/createFormDialog'
export { createFormDrawer } from './src/functional/createFormDrawer'

export * from './src/typing'
