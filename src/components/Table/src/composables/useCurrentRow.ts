import type { ElTable } from 'element-plus'
import type { Ref } from 'vue'

import { ref, unref } from 'vue'

export function useCurrentRow(tableRef: Ref<Nullable<InstanceType<typeof ElTable>>>) {
  const currentRowRef = ref<Nullable<Recordable>>(null)

  function setCurrentRow(row: Recordable) {
    unref(tableRef)?.setCurrentRow(row)
  }

  function getCurrentRow() {
    return unref(currentRowRef)
  }

  function setCurrentRowRef(row: Recordable) {
    currentRowRef.value = row
  }

  return {
    setCurrentRow,
    getCurrentRow,
    // Internal use
    setCurrentRowRef,
    currentRowRef,
  }
}
