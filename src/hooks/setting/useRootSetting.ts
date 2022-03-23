import type { ProjectConfig } from '/#/config'

import { computed } from 'vue'
import { useAppStore } from '/@/stores/modules/app'

type RootSetting = Omit<ProjectConfig, 'grayMode' | 'showBreadCrumb' | 'showFooter'>

export function useRootSetting() {
  const appStore = useAppStore()

  const getGrayMode = computed(() => appStore.getProjectConfig.grayMode)

  const getShowBreadCrumb = computed(() => appStore.getProjectConfig.showBreadCrumb)

  const getShowFooter = computed(() => appStore.getProjectConfig.showFooter)

  function setRootSetting(setting: Partial<RootSetting>) {
    appStore.setProjectConfig(setting)
  }

  return {
    setRootSetting,

    getGrayMode,
    getShowBreadCrumb,
    getShowFooter,
  }
}
