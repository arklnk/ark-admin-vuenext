import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps } from '../types/table'
import type { ElTable } from 'element-plus'

import { computed, unref } from 'vue'

export function useTableExpand(
  getProps: ComputedRef<BasicTableProps>,
  tableRef: Ref<Nullable<InstanceType<typeof ElTable>>>
) {
  const getChildrenName = computed(() => {
    return unref(getProps).treeProps?.children
  })

  function handleRowClickToggleExpand(row: any, event: Event) {
    // tree table and must be a cell target， a blank is in effect
    // highlightCurrentRow is true then do not process
    if (
      !unref(getProps).highlightCurrentRow &&
      Reflect.has(row, unref(getChildrenName)!) &&
      event.target instanceof HTMLElement &&
      event.target.className.includes('cell')
    ) {
      unref(tableRef)?.toggleRowExpansion(row)
    }
  }

  function toggleRowExpansion(row: Recordable, expanded?: boolean) {
    unref(tableRef)?.toggleRowExpansion(row, expanded)
  }

  return {
    handleRowClickToggleExpand,
    toggleRowExpansion,
  }
}
