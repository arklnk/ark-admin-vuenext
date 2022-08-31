import type { ComputedRef } from 'vue'
import type { BasicTableProps, GetColumnsParams } from '../types/table'
import type { TableColumn } from '../types/column'

import { ref, unref, computed, watch, toRaw } from 'vue'
import { cloneDeep, isBoolean, isFunction } from 'lodash-es'
import { filter } from '/@/utils/helper/tree'

export function useColumns(getProps: ComputedRef<BasicTableProps>) {
  const columnsRef = ref<Nullable<TableColumn[]>>(unref(getProps).columns)

  function isHidden(column: TableColumn): boolean {
    const hidden = column.hidden

    if (isBoolean(hidden)) {
      return hidden
    }
    if (isFunction(hidden)) {
      return hidden(column)
    }
    return false
  }

  const getColumnsRef = computed((): TableColumn[] => {
    const columns = cloneDeep(unref(columnsRef))

    if (!columns) {
      return []
    }

    return columns
  })

  const getViewColumnsRef = computed((): TableColumn[] => {
    const viewColumns = cloneDeep(unref(getColumnsRef))

    return filter(viewColumns, (col) => {
      return !isHidden(col)
    })
  })

  function setColumns(columns: TableColumn[]) {
    if (!Array.isArray(columns)) return

    if (columns.length <= 0) {
      columnsRef.value = []
      return
    }

    columnsRef.value = cloneDeep(columns)
  }

  function getColumns(params?: GetColumnsParams) {
    const { ignoreExpand, ignoreIndex, ignoreSelection } = params || {}
    const ignore: TableColumn['type'][] = []
    if (ignoreExpand) {
      ignore.push('expand')
    }
    if (ignoreIndex) {
      ignore.push('index')
    }
    if (ignoreSelection) {
      ignore.push('selection')
    }

    let columns = toRaw(unref(getColumnsRef))

    if (ignore.length > 0) {
      columns = columns.filter((c) => {
        return !(c.type && ignore.includes(c.type))
      })
    }
    return columns
  }

  watch(
    () => unref(getProps).columns,
    (cols) => {
      columnsRef.value = cols
    }
  )

  return {
    getColumnsRef,
    getViewColumnsRef,
    setColumns,
    getColumns,
  }
}
