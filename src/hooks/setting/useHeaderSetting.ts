import type { HeaderSetting } from '/#/config'

import { computed } from 'vue'
import { useAppStore } from '/@/stores/modules/app'

export function useHeaderSetting() {
  const appStore = useAppStore()

  const getFixed = computed(() => appStore.getHeaderSetting.fixed)

  const getBgColor = computed(() => appStore.getHeaderSetting.bgColor)

  const getShowFullScreen = computed(() => appStore.getHeaderSetting.showFullScreen)

  const getHeaderTheme = computed(() => appStore.getHeaderSetting.theme)

  /* set header */
  function setHeaderSetting(headerSetting: Partial<HeaderSetting>) {
    appStore.setProjectConfig({ headerSetting })
  }

  return {
    setHeaderSetting,

    getShowFullScreen,
    getBgColor,
    getFixed,
    getHeaderTheme,
  }
}
