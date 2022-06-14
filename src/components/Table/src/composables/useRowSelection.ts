import type { ComputedRef, Ref } from 'vue'
import type { ElTable } from 'element-plus'
import type { BasicTableProps } from '../types/table'

import { ref, unref, nextTick, watch, computed } from 'vue'
import { ROW_KEY } from '../const'

export function useRowSelection(
  props: ComputedRef<BasicTableProps>,
  tableRef: Ref<Nullable<InstanceType<typeof ElTable>>>,
  emit: EmitFn
) {
  const selectionRowsRef = ref<Recordable[]>([])

  watch(
    () => selectionRowsRef,
    () => {
      nextTick(() => {
        emit('selection-change', getSelectionRows)
      })
    },
    {
      deep: true,
    }
  )

  const getAutoCreateKey = computed(() => {
    return unref(props).autoCreateKey && !unref(props).rowKey
  })

  const getRowKey = computed(() => {
    const { rowKey } = unref(props)
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey
  })

  function handleSelectChange(_: Recordable[], row: Recordable) {
    const rowKeyName = unref(getRowKey)
    let targetKeyName: string
    if (typeof rowKeyName === 'function') {
      targetKeyName = rowKeyName(row)
    } else {
      targetKeyName = rowKeyName as string
    }

    const targetKey = row[targetKeyName]

    // 查找是否存在
    const index = unref(selectionRowsRef).findIndex((item) => item[targetKeyName] === targetKey)
    if (index === -1) {
      unref(selectionRowsRef).push(row)
    } else {
      unref(selectionRowsRef).slice(index, 1)
    }
  }

  function handleSelectAllChange(_rows: Recordable[]) {}

  function clearSelectionRows() {
    selectionRowsRef.value = []
  }

  function getSelectionRows<T = Recordable>() {
    return unref(selectionRowsRef) as T[]
  }

  return {
    clearSelectionRows,
    getSelectionRows,
    handleSelectChange,
    handleSelectAllChange,
  }
}
