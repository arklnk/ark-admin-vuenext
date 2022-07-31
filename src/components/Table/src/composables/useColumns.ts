import type { ComputedRef } from 'vue'
import type { BasicTableProps } from '../types/table'
import type { BasicColumn } from '../types/column'

import { ref, unref, computed } from 'vue'
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

  return {
    getColumnsRef,
  }
}
