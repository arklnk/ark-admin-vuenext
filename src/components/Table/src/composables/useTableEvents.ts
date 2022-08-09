/**
 * 注册原有的ElTable事件
 */
export function useTableEvents(emit: EmitFn) {
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

  function handleRowClick(...args: any[]) {
    emit('row-click', ...args)
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

  return {
    handleSelect,
    handleSelectAll,
    handleSelectionChange,
    handleCellMouseEnter,
    handleCellMouseLeave,
    handleCellContextMenu,
    handleCellClick,
    handleCellDblclick,
    handleRowClick,
    handleRowContextmenu,
    handleRowDblclick,
    handleHeaderClick,
    handleHeaderContextmenu,
    handleSortChange,
    handleFilterChange,
    handleCurrentChange,
    handleHeaderDragend,
    handleExpandChange,
  }
}
