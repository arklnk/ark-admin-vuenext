import type { HeaderSetting } from '/#/config'

import { computed, unref } from 'vue'
import { useAppStore } from '/@/stores/modules/app'
import { useMenuSetting } from './useMenuSetting'
import { useRootSetting } from './useRootSetting'
import { useFullContent } from '../web/useFullContent'

export function useHeaderSetting() {
  const appStore = useAppStore()
  const { getFullContent } = useFullContent()
  const { getShowTopMenu } = useMenuSetting()
  const { getShowLogo } = useRootSetting()

  const getShowHeader = computed(() => !unref(getFullContent))

  const getFixed = computed(() => appStore.getHeaderSetting.fixed)

  const getBgColor = computed(() => appStore.getHeaderSetting.bgColor)

  const getShowFullScreen = computed(() => appStore.getHeaderSetting.showFullScreen)

  const getHeaderTheme = computed(() => appStore.getHeaderSetting.theme)

  const getShowHeaderLogo = computed(() => unref(getShowLogo) && unref(getShowTopMenu))

  /* set header */
  function setHeaderSetting(headerSetting: Partial<HeaderSetting>) {
    appStore.setProjectConfig({ headerSetting })
  }

  return {
    setHeaderSetting,

    getShowHeader,
    getShowFullScreen,
    getBgColor,
    getFixed,
    getHeaderTheme,
    getShowHeaderLogo,
  }
}
