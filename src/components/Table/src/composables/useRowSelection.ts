import type { ComputedRef } from 'vue'
import type { BasicTableProps } from '../types/table'

import { reactive, watch, nextTick } from 'vue'

export function useRowSelection(_props: ComputedRef<BasicTableProps>, emit: EmitFn) {
  const selectionRows = reactive<Map<number, Recordable[]>>(new Map())

  watch(
    () => selectionRows,
    () => {
      nextTick(() => {
        emit('selection-change', getSelectionRows)
      })
    },
    {
      deep: true
    }
  )

  function clearSelectionRows() {
    selectionRows.clear()
  }

  function getSelectionRows<T = Recordable>() {
    return [] as T[]
  }

  return {
    clearSelectionRows,

    getSelectionRows,
  }
}
