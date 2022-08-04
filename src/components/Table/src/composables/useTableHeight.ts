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
  wrapElRef: Ref,
  toolbarRef: Ref
) {
  const tableHeightRef = ref<number>(120)

  /**
   * 动态计算table高度，以方便固定表头进行数据滚动
   */
  async function calcTableHeight() {
    const { canResize, canResizeWrap, resizeHeightOffset, pagination } = unref(getProps)

    const table = unref(tableElRef)
    if (!table) return

    // wrap and table real dom
    const tableEl: HTMLElement = table.$el
    const wrapEl: HTMLElement = unref(wrapElRef)
    if (!tableEl || !wrapEl) return

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

    // table height from bottom height-custom offset
    let paddingHeight = 0
    const ZERO_PX = '0px'
    const wrapStyle = getComputedStyle(wrapEl)

    let bottomIncludeBody = 0

    // 判断两种情况，一种情况为wrap容器固定高度，第二种情况则自动定高
    if (canResizeWrap) {
      // 防止wrap容器被设置padding导致计算错误
      paddingHeight +=
        numberUnit(wrapStyle.paddingBottom ?? ZERO_PX) + numberUnit(wrapStyle.paddingTop ?? ZERO_PX)

      // table容器定高时，则直接使用wrap的高度，offsetHeight会包括padding高度
      const wrapHeight = wrapEl.offsetHeight || 0

      // 计算toolbar高度
      let toolbarHeight = 0
      if (unref(toolbarRef)) {
        toolbarHeight = (unref(toolbarRef) as HTMLElement).offsetHeight
      }

      bottomIncludeBody = wrapHeight - toolbarHeight
    } else {
      // 当不定高情况时计算padding bottom，padding top不参与计算
      paddingHeight += numberUnit(wrapStyle.paddingBottom ?? ZERO_PX)

      // 尝试获取wrap的父容器是否存在padding或margin的bottom值，例如使用Page容器包裹
      const parentStyle = getComputedStyle(wrapEl.parentElement!)
      paddingHeight +=
        numberUnit(parentStyle.paddingBottom ?? ZERO_PX) +
        numberUnit(parentStyle.marginBottom ?? ZERO_PX)

      // 容器不定高，则计算从el-table-header剩余高度
      bottomIncludeBody = getViewportOffset(headEl).bottomIncludeBody
    }

    // calc remaining height
    const height = bottomIncludeBody - (resizeHeightOffset || 0) - paddingHeight - footerHeight
    // set height
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
