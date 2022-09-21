import type { ComputedRef } from 'vue'
import type { BasicTableProps, GetColumnsParams } from '../types/table'
import type { PaginationProps } from '../types/pagination'
import type { TableColumn } from '../types/column'

import { ref, unref, computed, watch, toRaw } from 'vue'
import { cloneDeep, isBoolean, isFunction } from 'lodash-es'
import { useTransl } from '/@/composables/core/useTransl'
import { filter } from '/@/utils/helper/tree'
import { DEFAULT_PAGE_SIZE } from '../const'

function processIndexColumn(
  columns: TableColumn[],
  getPagination: () => Nullable<PaginationProps>
) {
  const { t } = useTransl()

  let pushIndexColumn = false
  let deletedColumn: TableColumn

  // 查找所有的index序号列，赋予默认处理
  columns.forEach((col) => {
    if (Reflect.has(col, 'children') && col.children && col.children.length > 0) {
      // deep process
      processIndexColumn(col.children, getPagination)
    }

    if (col.type !== 'index') return

    const indIndex = columns.findIndex((i) => i.type === 'index')
    pushIndexColumn = indIndex !== -1
    if (pushIndexColumn) {
      deletedColumn = columns.splice(indIndex, 1)[0]
    }
  })

  if (!pushIndexColumn) return

  columns.unshift({
    label: t('component.table.index'),
    align: 'center',
    width: 80,
    index: (i: number) => {
      const pagination = getPagination()
      if (!pagination) {
        return i + 1
      }
      const { currentPage = 1, pageSize = DEFAULT_PAGE_SIZE } = pagination

      return ((currentPage < 1 ? 1 : currentPage) - 1) * pageSize + i + 1
    },
    ...deletedColumn!,
  })
}

export function useColumns(
  getProps: ComputedRef<BasicTableProps>,
  getPagination: () => Nullable<PaginationProps>
) {
  const columnsRef = ref<TableColumn[]>(unref(getProps).columns || [])

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

    // 处理序号列
    processIndexColumn(columns, getPagination)

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
      columns = filter(columns, (c) => {
        return !(c.type && ignore.includes(c.type))
      })
    }
    return columns
  }

  watch(
    () => unref(getProps).columns,
    (cols) => {
      columnsRef.value = cols || []
    }
  )

  return {
    getColumnsRef,
    getViewColumnsRef,
    setColumns,
    getColumns,
  }
}
