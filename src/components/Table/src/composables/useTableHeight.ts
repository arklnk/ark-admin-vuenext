import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps } from '../types/table'

import { ref, unref, nextTick, computed, watch } from 'vue'
import { onMountedOrActivated } from '/@/composables/core/onMountedOrActivated'
import { getViewportOffset } from '/@/utils/dom'
import { isBoolean } from 'lodash-es'
import { useWindowSizeFn } from '/@/composables/event/useWindowSizeFn'
import { numberUnit } from '/@/utils'

export function useTableHeight(
  getProps: ComputedRef<BasicTableProps>,
  tableElRef: Ref,
  footerElRef: Ref,
  wrapElRef: Ref
) {
  const tableHeightRef = ref<number>(120)

  /**
   * 动态计算table高度，以方便固定表头进行数据滚动
   */
  async function calcTableHeight() {
    const { canResize, wrapHeightFixed, resizeHeightOffset, pagination } = unref(getProps)

    const table = unref(tableElRef)
    if (!table) return

    const tableEl: HTMLElement = table.$el
    if (!tableEl) return

    // can' t resize
    if (!canResize) return

    // add a delay to get the correct bottomIncludeBody paginationHeight footerHeight headerHeight
    await nextTick()

    const headEl = tableEl.querySelector('.el-table__header')
    if (!headEl) return

    // 启用分页时，计算footer高度
    let footerHeight = 0
    if (!isBoolean(pagination)) {
      footerHeight += (unref(footerElRef) as HTMLElement)?.offsetHeight || 0
    }

    let bottomIncludeBody = 0

    if (unref(wrapElRef) && wrapHeightFixed) {
      // table容器定高
      const wrapHeight = (unref(wrapElRef) as HTMLElement)?.offsetHeight || 0

      bottomIncludeBody = wrapHeight
    } else {
      let bottomSpace = 0
      const ZERO_PX = '0px'

      // 尝试查找包裹table的父容器的底部占用高度，避免底部margin或者padding导致高度计算不准确
      // BasicTable不应被多层容器嵌套，如果被多层容器嵌套，则应该将wrap容器定高并开启wrapHeightFixed
      const parentEl = (unref(wrapElRef) as HTMLElement)?.parentElement
      if (parentEl) {
        const style = getComputedStyle(parentEl)
        const marginBottom = numberUnit(style.marginBottom ?? ZERO_PX)
        const paddingBottom = numberUnit(style.paddingBottom ?? ZERO_PX)

        bottomSpace = marginBottom + paddingBottom
      }

      // 容器不定高，则计算el-table-header剩余高度
      bottomIncludeBody = getViewportOffset(headEl).bottomIncludeBody - bottomSpace
    }

    const height = bottomIncludeBody - (resizeHeightOffset || 0) - footerHeight

    tableHeightRef.value = height
  }

  const getTableHeight = computed((): number | null => {
    const { canResize } = unref(getProps)

    return canResize ? unref(tableHeightRef) : null
  })

  useWindowSizeFn(calcTableHeight, 280)

  watch(
    () => unref(getProps).canResize,
    () => {
      redoHeight()
    },
    {
      flush: 'post',
    }
  )

  onMountedOrActivated(() => {
    redoHeight()
  })

  function redoHeight() {
    nextTick(() => {
      calcTableHeight()
    })
  }

  return {
    getTableHeight,
    redoHeight,
  }
}
