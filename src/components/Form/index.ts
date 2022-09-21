import BasicFormComp from './src/BasicForm.vue'
import { withInstall } from '/@/utils'

export const BasicForm = withInstall(BasicFormComp)

export { useForm } from './src/composables/useForm'

export { createFormDialog, BasicFormDialog } from './src/functional/createFormDialog'

export * from './src/typing'
