import BasicFormComp from './src/BasicForm.vue'
import { withInstall } from '/@/utils'

export const BasicForm = withInstall(BasicFormComp)

export { useForm } from './src/composables/useForm'

export * from './src/typing'
