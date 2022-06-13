import type { ComputedRef, Ref } from 'vue'
import type { ElTable } from 'element-plus'
import type { BasicTableProps } from '../types/table'

import { ref, unref, nextTick, watch } from 'vue'

export function useRowSelection(
  props: ComputedRef<BasicTableProps>,
  tableRef: Ref<Nullable<InstanceType<typeof ElTable>>>,
  emit: EmitFn
) {
  const selectionRows = ref<Recordable[]>([])

  watch(
    () => selectionRows,
    () => {
      nextTick(() => {
        emit('selection-change', getSelectionRows)
      })
    },
    {
      deep: true,
    }
  )

  function clearSelectionRows() {
    selectionRows.value = []
  }

  function getSelectionRows<T = Recordable>() {
    return unref(selectionRows) as T[]
  }

  return {
    clearSelectionRows,
    getSelectionRows,
  }
}
