import type { ComputedRef } from 'vue'

import { isString, isNumber } from 'lodash-es'
import { nextTick, Ref, ref, unref, watch, isRef } from 'vue'
import { onMountedOrActivated } from '../core/onMountedOrActivated'
import { useWindowSizeFn } from '../event/useWindowSizeFn'
import { useLayoutHeight } from '/@/layouts/default/content/useLayoutHeight'
import { numberUnit } from '/@/utils'
import { getViewportOffset } from '/@/utils/dom'

type Upward = string | number | null | undefined

/**
 * 动态计算内容高度，根据锚点dom最下坐标到屏幕最下坐标，根据传入dom的高度、padding、margin等值进行动态计算
 * 最终获取合适的内容高度
 * @link https://github.com/vbenjs/vben-admin-thin-next/blob/main/src/composables/web/useContentHeight.ts
 *
 * @param flag 用于开启计算的响应式标识
 * @param anchorRef 锚点组件 Ref<ElRef | ComponentRef>
 * @param subtractHeightRefs 待减去高度的组件列表 Ref<ElRef | ComponentRef>
 * @param substractSpaceRefs 待减去空闲空间(margins/paddings)的组件列表 Ref<ElRef | ComponentRef>
 * @param upwardSpace 向上递归减去空闲空间的 层级 或 直到指定class为止 数值为2代表向上递归两次|数值为app-layout表示向上递归直到碰见.app-layout为止
 * @param offsetHeightRef 计算偏移的响应式高度，计算高度时将直接减去此值
 * @returns 响应式高度
 */
export function useContentHeight(
  flag: ComputedRef<boolean>,
  anchorRef: Ref,
  subtractHeightRefs: Ref[],
  substractSpaceRefs: Ref[],
  upwardSpace: Ref<Upward> | ComputedRef<Upward> | Upward = 0,
  offsetHeightRef: Ref<number> = ref(0)
) {
  const contentHeight: Ref<number> = ref(0)
  const { appFooterHeightRef: layoutFooterHeightRef } = useLayoutHeight()

  function getEl(element: any): Nullable<HTMLDivElement> {
    if (element === null) return null
    return (element instanceof HTMLDivElement ? element : element.$el) as HTMLDivElement
  }

  function calcSubtractSpace(
    element: Element | null | undefined,
    direction: 'all' | 'top' | 'bottom' = 'all'
  ): number {
    let subtractHeight = 0
    const ZERO_PX = '0px'
    if (element) {
      const cssStyle = getComputedStyle(element)
      const marginTop = numberUnit(cssStyle?.marginTop ?? ZERO_PX)
      const marginBottom = numberUnit(cssStyle?.marginBottom ?? ZERO_PX)
      const paddingTop = numberUnit(cssStyle?.paddingTop ?? ZERO_PX)
      const paddingBottom = numberUnit(cssStyle?.paddingBottom ?? ZERO_PX)
      if (direction === 'all') {
        subtractHeight += marginTop
        subtractHeight += marginBottom
        subtractHeight += paddingTop
        subtractHeight += paddingBottom
      } else if (direction === 'top') {
        subtractHeight += marginTop
        subtractHeight += paddingTop
      } else {
        subtractHeight += marginBottom
        subtractHeight += paddingBottom
      }
    }
    return subtractHeight
  }

  async function calcContentHeight() {
    if (!flag.value) {
      return
    }

    // 添加延迟以获得正确的高度
    await nextTick()

    const anchorEl = getEl(unref(anchorRef))

    if (!anchorEl) {
      return
    }

    const { bottomIncludeBody } = getViewportOffset(anchorEl)

    // 待减去的元素高度
    let substractHeight = 0
    subtractHeightRefs.forEach((el) => {
      substractHeight += getEl(unref(el))?.offsetHeight || 0
    })

    // 待减去元素的margin以及padding高度
    let substractSpaceHeight = calcSubtractSpace(anchorEl)
    substractSpaceRefs.forEach((el) => {
      substractSpaceHeight += calcSubtractSpace(getEl(unref(el)))
    })

    // 向上递归减去空闲空间的 层级 或 直到指定class为止
    let upwardSpaceHeight = 0
    function upward(element: Element | null, lvOrClass: number | string | null | undefined) {
      if (element && lvOrClass) {
        const parent = element.parentElement
        if (parent) {
          // find class
          if (isString(lvOrClass)) {
            if (!parent.classList.contains(lvOrClass)) {
              upwardSpaceHeight += calcSubtractSpace(parent, 'bottom')
              upward(parent, lvOrClass)
            } else {
              upwardSpaceHeight += calcSubtractSpace(parent, 'bottom')
            }
          } else if (isNumber(lvOrClass as unknown as string)) {
            if (lvOrClass > 0) {
              upwardSpaceHeight += calcSubtractSpace(parent, 'bottom')
              upward(parent, --lvOrClass)
            }
          }
        }
      }
    }
    if (isRef(upwardSpace)) {
      upward(anchorEl, unref(upwardSpace))
    } else {
      upward(anchorEl, upwardSpace)
    }

    const height =
      bottomIncludeBody -
      unref(offsetHeightRef) -
      substractHeight -
      substractSpaceHeight -
      upwardSpaceHeight

    contentHeight.value = height
  }

  function redoHeight() {
    nextTick(() => {
      calcContentHeight()
    })
  }

  onMountedOrActivated(() => {
    nextTick(() => {
      calcContentHeight()
    })
  })

  useWindowSizeFn(
    () => {
      calcContentHeight()
    },
    50,
    { immediate: true }
  )

  watch(
    () => [layoutFooterHeightRef.value],
    () => {
      calcContentHeight()
    },
    {
      flush: 'post',
      immediate: true,
    }
  )

  return {
    contentHeight,
    redoHeight,
  }
}
