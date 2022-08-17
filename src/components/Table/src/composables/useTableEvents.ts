import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps } from '../types/table'
import type { ElTable } from 'element-plus'

import { unref, computed } from 'vue'
import { DEFAULT_CHILDREN_KEY } from '../const'

/**
 * 注册原有的ElTable事件
 */
export function useTableEvents(
  emit: EmitFn,
  getProps: ComputedRef<BasicTableProps>,
  tableRef: Ref<Nullable<InstanceType<typeof ElTable>>>
) {
  const getChildrenName = computed(() => {
    return unref(getProps).treeProps?.children || DEFAULT_CHILDREN_KEY
  })

  function handleSelect(...args: any[]) {
    emit('select', ...args)
  }

  function handleSelectAll(...args: any[]) {
    emit('select-all', ...args)
  }

  function handleSelectionChange(...args: any[]) {
    emit('selection-change', ...args)
  }

  function handleCellMouseEnter(...args: any[]) {
    emit('cell-mouse-enter', ...args)
  }

  function handleCellMouseLeave(...args: any[]) {
    emit('cell-mouse-leave', ...args)
  }

  function handleCellContextMenu(...args: any[]) {
    emit('cell-contextmenu', ...args)
  }

  function handleCellClick(...args: any[]) {
    emit('cell-click', ...args)
  }

  function handleCellDblclick(...args: any[]) {
    emit('cell-dblclick', ...args)
  }

  function handleRowClick(row: Recordable, ...args: any[]) {
    emit('row-click', row, ...args)

    // tree table
    if (Reflect.has(row, unref(getChildrenName))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      unref(tableRef)?.toggleRowExpansion(row)
    }
  }

  function handleRowContextmenu(...args: any[]) {
    emit('row-contextmenu', ...args)
  }

  function handleRowDblclick(...args: any[]) {
    emit('row-dblclick', ...args)
  }

  function handleHeaderClick(...args: any[]) {
    emit('header-click', ...args)
  }

  function handleHeaderContextmenu(...args: any[]) {
    emit('header-contextmenu', ...args)
  }

  function handleSortChange(...args: any[]) {
    emit('sort-change', ...args)
  }

  function handleFilterChange(...args: any[]) {
    emit('filter-change', ...args)
  }

  function handleCurrentChange(...args: any[]) {
    emit('current-change', ...args)
  }

  function handleHeaderDragend(...args: any[]) {
    emit('header-dragend', ...args)
  }

  function handleExpandChange(...args: any[]) {
    emit('expand-change', ...args)
  }

  const onTableEvent: Recordable = {
    onSelect: handleSelect,
    onSelectAll: handleSelectAll,
    onSelectionChange: handleSelectionChange,
    onCellMouseEnter: handleCellMouseEnter,
    onCellMouseLeave: handleCellMouseLeave,
    onCellContextMenu: handleCellContextMenu,
    onCellClick: handleCellClick,
    onCellDblclick: handleCellDblclick,
    onRowClick: handleRowClick,
    onRowContextmenu: handleRowContextmenu,
    onRowDblclick: handleRowDblclick,
    onHeaderClick: handleHeaderClick,
    onHeaderContextmenu: handleHeaderContextmenu,
    onSortChange: handleSortChange,
    onFilterChange: handleFilterChange,
    onCurrentChange: handleCurrentChange,
    onHeaderDragend: handleHeaderDragend,
    onExpandChange: handleExpandChange,
  }

  return {
    onTableEvent,
  }
}
