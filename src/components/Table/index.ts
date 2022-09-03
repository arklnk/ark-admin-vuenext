import BasicTableComp from './src/BasicTable.vue'
import TableActionComp from './src/components/TableAction.vue'

import { withInstall } from '/@/utils'

export const BasicTableAction = withInstall(TableActionComp)
export const BasicTable = withInstall(BasicTableComp)

export { useTable } from './src/composables/useTable'

export * from './src/types/column'
export * from './src/types/pagination'
export * from './src/types/table'
export * from './src/types/action'
