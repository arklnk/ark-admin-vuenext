import type { BasicTableActionType, BasicTableProps } from '../types/table'
import type { ElTable } from 'element-plus'
import type { Ref, ComputedRef } from 'vue'

import { inject, provide } from 'vue'

const tableKey = Symbol('basic-table')

type Instance = BasicTableActionType & {
  wrapRef: Ref<Nullable<HTMLDivElement>>
  tableRef: Ref<Nullable<InstanceType<typeof ElTable>>>
  getBindValues: ComputedRef<Recordable>
}

type RetInstance = Omit<Instance, 'getBindValues'> & {
  getBindValues: ComputedRef<BasicTableProps>
}

export function createTableContext(instance: Instance) {
  provide(tableKey, instance)
}

export function useTableContext(): RetInstance {
  return inject(tableKey) as RetInstance
}
