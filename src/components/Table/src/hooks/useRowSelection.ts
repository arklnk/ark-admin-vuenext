import { ComputedRef, unref } from 'vue'
import type { BasicTableProps } from '../types/table'

import { ref } from 'vue'

export function useRowSelection(_props: ComputedRef<BasicTableProps>, _emit: EmitFn) {
  const selectedRowRef = ref<Recordable[]>([])

  function getSelectedRows<T = Recordable>() {
    return unref(selectedRowRef) as T[]
  }

  return {
    getSelectedRows,
  }
}
