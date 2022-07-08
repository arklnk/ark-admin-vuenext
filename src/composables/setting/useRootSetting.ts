import type { ProjectConfig } from '/#/config'

import { computed } from 'vue'
import { useAppStore } from '/@/stores/modules/app'
import { ThemeEnum } from '/@/enums/appEnum'

type RootSetting = Omit<
  ProjectConfig,
  'menuSetting' | 'elementUISetting' | 'headerSetting' | 'transitionSetting'
>

export function useRootSetting() {
  const appStore = useAppStore()

  const getGrayMode = computed(() => appStore.getProjectConfig.grayMode)

  const getShowBreadCrumb = computed(() => appStore.getProjectConfig.showBreadCrumb)

  const getShowFooter = computed(() => appStore.getProjectConfig.showFooter)

  const getThemeColor = computed(() => appStore.getProjectConfig.themeColor)

  const getColorWeak = computed(() => appStore.getProjectConfig.colorWeak)

  const getShowLogo = computed(() => appStore.getProjectConfig.showLogo)

  const getContentMode = computed(() => appStore.getProjectConfig.contentMode)

  const getShowSettingButton = computed(() => appStore.getProjectConfig.showSettingButton)

  const getFullContent = computed(() => appStore.getProjectConfig.fullContent)

  const getRemoveAllHttpPending = computed(() => appStore.getProjectConfig.removeAllHttpPending)

  const getTheme = computed(() => appStore.getDarkMode)

  const getUseOpenBackTop = computed(() => appStore.getProjectConfig.useOpenBackTop)

  const getOpenKeepAlive = computed(() => appStore.getProjectConfig.openKeepAlive)

  function setRootSetting(setting: Partial<RootSetting>) {
    appStore.setProjectConfig(setting)
  }

  function setDarkMode(mode: ThemeEnum) {
    appStore.setDarkMode(mode)
  }

  return {
    setRootSetting,
    setDarkMode,

    getFullContent,
    getShowSettingButton,
    getContentMode,
    getRemoveAllHttpPending,
    getShowLogo,
    getColorWeak,
    getThemeColor,
    getGrayMode,
    getShowBreadCrumb,
    getShowFooter,
    getTheme,
    getUseOpenBackTop,
    getOpenKeepAlive,
  }
}
