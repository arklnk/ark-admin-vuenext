import type { ElTable } from 'element-plus'
import type { Ref } from 'vue'

import { unref } from 'vue'

export function useRowSelection(tableRef: Ref<Nullable<InstanceType<typeof ElTable>>>) {
  function clearSelection() {
    unref(tableRef)?.clearSelection()
  }

  function getSelectionRows<T = Recordable>(): T[] {
    const table = unref(tableRef)
    if (!table) return []
    return table.getSelectionRows()
  }

  function toggleRowSelection(row: Recordable, selected?: boolean) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    unref(tableRef)?.toggleRowSelection(row, selected)
  }

  function toggleAllSelection() {
    unref(tableRef)?.toggleAllSelection()
  }

  return {
    clearSelection,
    getSelectionRows,
    toggleRowSelection,
    toggleAllSelection,
  }
}
