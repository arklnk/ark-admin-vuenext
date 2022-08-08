import type { Ref } from 'vue'
import type { ThemeEnum } from '/@/enums/appEnum'
import type { EChartsOption } from 'echarts'

import { computed, unref, watch, nextTick } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import { useRootSetting } from '/@/composables/setting/useRootSetting'
import echarts from '/@/utils/lib/echarts'
import { useWindowSizeFn } from '/@/composables/event/useWindowSizeFn'

export function useECharts(
  elRef: Ref<Nullable<HTMLDivElement>>,
  theme: ThemeEnum | 'default' = 'default'
) {
  const { getTheme } = useRootSetting()
  const getDarkMode = computed(() => {
    return theme === 'default' ? getTheme.value : theme
  })

  let chartsInstance: echarts.ECharts | null = null
  // 记录最近一次setOption的配置
  let cacheOption: EChartsOption = {}

  function initCharts() {
    const el = unref(elRef)
    if (!el) return

    // 初始化
    chartsInstance = echarts.init(el, unref(getDarkMode))

    // window resize event
    useWindowSizeFn(resize, 200)
  }

  function getOption(): EChartsOption {
    // 合并默认配置，取消dark下的backgroundColor
    return {
      backgroundColor: 'transparent',
      ...(cacheOption || {}),
    }
  }

  function setOption(option: EChartsOption, clear = true) {
    cacheOption = option

    nextTick(() => {
      if (!chartsInstance) {
        initCharts()

        if (!chartsInstance) return
      }

      clear && chartsInstance?.clear()

      chartsInstance?.setOption(getOption())
    })
  }

  function resize() {
    chartsInstance?.resize({
      animation: {
        duration: 500,
        easing: 'quadraticIn',
      },
    })
  }

  function getChartsInstance(): echarts.ECharts | null {
    if (!chartsInstance) {
      initCharts()
    }
    return chartsInstance
  }

  watch(
    () => unref(getDarkMode),
    () => {
      if (!chartsInstance) return

      chartsInstance.dispose()
      initCharts()
      setOption(getOption())
    }
  )

  tryOnUnmounted(() => {
    if (!chartsInstance) return

    chartsInstance.dispose()
    chartsInstance = null
  })

  return {
    initCharts,
    resize,
    setOption,
    getChartsInstance,
  }
}
