import type { ComputedRef } from 'vue'

import { ref, computed, unref } from 'vue'
import { useEventListener } from './useEventListener'
import { ScreenEnum, SizeEnum, screenMap } from '/@/enums/breakpointEnum'

export interface CreateCallbackParam {
  screenRef: ComputedRef<SizeEnum | undefined>
  widthRef: ComputedRef<number>
  realWidthRef: ComputedRef<number>
  screenEnum: typeof ScreenEnum
  sizeEnum: typeof SizeEnum
  screenMap: Map<SizeEnum, number>
}

let globalScreenRef: ComputedRef<SizeEnum | undefined>
let globalWidthRef: ComputedRef<number>
let globalRealWidthRef: ComputedRef<number>

export function useBreakpoint() {
  return {
    screenRef: globalScreenRef,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef,
    screenEnum: ScreenEnum,
    sizeEnum: SizeEnum,
    screenMap,
  }
}

export function createBreakpointListen(fn?: (opt: CreateCallbackParam) => void) {
  const screenRef = ref<SizeEnum>(SizeEnum.XL)
  const realWidthRef = ref<number>(window.innerWidth)

  function getWindowWidth() {
    // 元素的内部宽度，以像素计。该属性包括内边距 padding，但不包括边框 border、外边距 margin 和垂直滚动条
    const width = document.body.clientWidth
    const xs = screenMap.get(SizeEnum.XS)!
    const sm = screenMap.get(SizeEnum.SM)!
    const md = screenMap.get(SizeEnum.MD)!
    const lg = screenMap.get(SizeEnum.LG)!

    if (width < xs) {
      screenRef.value = SizeEnum.XS
    } else if (width < sm) {
      screenRef.value = SizeEnum.SM
    } else if (width < md) {
      screenRef.value = SizeEnum.MD
    } else if (width < lg) {
      screenRef.value = SizeEnum.LG
    } else {
      screenRef.value = SizeEnum.XL
    }

    realWidthRef.value = width
  }

  useEventListener({
    el: window,
    name: 'resize',
    listener: () => {
      getWindowWidth()
      resizeFn()
    },
  })

  getWindowWidth()
  globalScreenRef = computed(() => unref(screenRef.value))
  globalWidthRef = computed((): number => screenMap.get(unref(screenRef))!)
  globalRealWidthRef = computed(() => unref(realWidthRef))

  function resizeFn() {
    fn?.({
      screenRef: globalScreenRef,
      widthRef: globalWidthRef,
      realWidthRef: globalRealWidthRef,
      screenEnum: ScreenEnum,
      sizeEnum: SizeEnum,
      screenMap,
    })
  }

  resizeFn()

  return {
    screenRef: globalScreenRef,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef,
  }
}
