import type { ProjectConfig } from '/#/config'

import { computed } from 'vue'
import { useAppStore } from '/@/stores/modules/app'

type RootSetting = Omit<ProjectConfig, 'grayMode' | 'showBreadCrumb' | 'showFooter'>

export function useRootSetting() {
  const appStore = useAppStore()

  const getGrayMode = computed(() => appStore.getProjectConfig.grayMode)

  const getShowBreadCrumb = computed(() => appStore.getProjectConfig.showBreadCrumb)

  const getShowFooter = computed(() => appStore.getProjectConfig.showFooter)

  const getThemeColor = computed(() => appStore.getProjectConfig.themeColor)

  function setRootSetting(setting: Partial<RootSetting>) {
    appStore.setProjectConfig(setting)
  }

  return {
    setRootSetting,

    getThemeColor,
    getGrayMode,
    getShowBreadCrumb,
    getShowFooter,
  }
}
