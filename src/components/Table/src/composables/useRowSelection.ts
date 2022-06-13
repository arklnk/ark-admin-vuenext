import type { ComputedRef, Ref } from 'vue'
import type { ElTable } from 'element-plus'
import type { BasicTableProps } from '../types/table'

import { reactive, unref, nextTick } from 'vue'

export function useRowSelection(
  props: ComputedRef<BasicTableProps>,
  tableRef: Ref<Nullable<InstanceType<typeof ElTable>>>,
  emit: EmitFn
) {
  const selectionRows = reactive<Map<number, Recordable[]>>(new Map())

  function handleSelecitonRowsChange<T = Recordable>(_rows: T[]) {
    emit('selection-change', getSelectionRows)
  }

  function clearSelectionRows() {
    selectionRows.clear()

    unref(tableRef)?.clearSelection()
  }

  function setSelectionRows(page: number, rows: Recordable[]) {
    selectionRows.set(page, rows)
  }

  function toggleSelectionRows(page: number) {
    const rows = selectionRows.get(page)
    if (rows && rows.length > 0) {
      nextTick(() => {
        rows.forEach((row) => {
          unref(tableRef)?.toggleRowSelection(row, undefined as unknown as boolean)
        })
        unref(tableRef)?.toggleRowExpansion
      })
    }
  }

  function getSelectionRows<T = Recordable>() {
    let selectedRows: T[] = []
    selectionRows.forEach((rows, _page) => {
      if (rows && rows.length > 0) {
        selectedRows = selectedRows.concat(rows as T[])
      }
    })

    return selectedRows as T[]
  }

  return {
    clearSelectionRows,
    toggleSelectionRows,
    getSelectionRows,
    setSelectionRows,
    handleSelecitonRowsChange,
  }
}
