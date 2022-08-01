import type { ComputedRef } from 'vue'
import type { BasicTableProps } from '../types/table'
import type { BasicColumn } from '../types/column'

import { ref, unref, computed, watch } from 'vue'
import { cloneDeep } from 'lodash-es'

export function useColumns(getProps: ComputedRef<BasicTableProps>) {
  const columnsRef = ref<Nullable<BasicColumn[]>>(unref(getProps).columns)

  const getColumnsRef = computed((): BasicColumn[] => {
    const columns = cloneDeep(unref(columnsRef))

    if (!columns) {
      return []
    }

    return columns
  })

  function setColumns(columns: BasicColumn[]) {
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
