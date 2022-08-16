import BasicTableComp from './src/BasicTable.vue'
import { withInstall } from '/@/utils'

export const BasicTable = withInstall(BasicTableComp)

export { useTable } from './src/composables/useTable'

export * from './src/types/column'
export * from './src/types/pagination'
export * from './src/types/table'
