import type { ComputedRef } from 'vue'
import type { BasicTableProps } from '../types/table'
import type { TableColumn } from '../types/column'

import { ref, unref, computed, watch } from 'vue'
import { cloneDeep } from 'lodash-es'

export function useColumns(getProps: ComputedRef<BasicTableProps>) {
  const columnsRef = ref<Nullable<TableColumn[]>>(unref(getProps).columns)

  const getColumnsRef = computed((): TableColumn[] => {
    const columns = cloneDeep(unref(columnsRef))

    if (!columns) {
      return []
    }

    return columns
  })

  function setColumns(columns: TableColumn[]) {
    if (!Array.isArray(columns)) return

    columnsRef.value = []
  }

  watch(
    () => unref(getProps).columns,
    (cols) => {
      columnsRef.value = cols
    }
  )

  return {
    getColumnsRef,
    setColumns,
  }
}
