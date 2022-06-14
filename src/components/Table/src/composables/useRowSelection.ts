import type { ComputedRef } from 'vue'
import type { BasicTableProps } from '../types/table'

import { reactive, unref, watch, computed } from 'vue'
import { isEmpty } from 'lodash-es'

interface SelectedStateRow {
  selected: boolean
  row: Recordable
}

export function useRowSelection(props: ComputedRef<BasicTableProps>, _emit: EmitFn) {
  const selectedRowsRef = reactive<Map<string | number, SelectedStateRow>>(new Map())

  watch(
    () => unref(props).rowSelection?.selectedRowKeys,
    (keys: (string | number)[] | undefined) => {
      console.log(keys)
    }
  )

  const getShowSelectionRef = computed((): boolean => {
    const rowSelection = unref(props).rowSelection
    return isEmpty(rowSelection)
  })

  function clearSelectionRows() {
    selectedRowsRef.clear()
  }

  function getSelectionRows<T = Recordable>() {
    return [] as T[]
  }

  return {
    clearSelectionRows,
    getSelectionRows,
    getShowSelectionRef,
  }
}
