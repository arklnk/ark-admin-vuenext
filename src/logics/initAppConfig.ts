import type { ProjectConfig } from '/#/config'

import { useAppStore } from '/@/stores/modules/app'
import { useUserStore } from '/@/stores/modules/user'
import defaultSetting from '/@/settings/projectSetting'
import { getToken } from '/@/utils/auth'
import { updateTheme } from './theme/updateTheme'
import { updateGrayMode } from './theme/updateGrayMode'
import { updateColorWeak } from './theme/updateColorWeak'
import { updateHeaderBgColor, updateSidebarBgColor } from './theme/updateBackground'
import { KEY_SETTING } from '/@/enums/cacheEnum'
import { merge } from 'lodash-es'
import { updateDarkMode } from './theme/updateDarkMode'
import { ThemeEnum } from '../enums/appEnum'
import { useLocaleStore } from '../stores/modules/locale'
import WebStorage from '/@/utils/cache'

/**
 * Initial project configuration
 */
export function initAppConfig() {
  const appStore = useAppStore()
  const userStore = useUserStore()
  const localeStore = useLocaleStore()

  // setup global config
  try {
    const config = WebStorage.get(KEY_SETTING, {}) as ProjectConfig
    appStore.setProjectConfig(merge({}, defaultSetting, config))
  } catch (err) {
    appStore.setProjectConfig(defaultSetting)
  }

  const darkMode = appStore.getDarkMode

  const {
    grayMode,
    colorWeak,
    themeColor,
    menuSetting: { bgColor },
    headerSetting: { bgColor: headerbgColor },
  } = appStore.getProjectConfig

  // update primary theme color
  updateTheme(themeColor)

  if (darkMode === ThemeEnum.DARK) {
    // 夜间模式
    updateDarkMode(darkMode)

    // 更新夜间模式下的配置，以防被手动修改了非夜间模式不支持的背景设置
    updateSidebarBgColor()
    updateHeaderBgColor()
  } else {
    // update background
    bgColor && updateSidebarBgColor(bgColor)
    headerbgColor && updateHeaderBgColor(headerbgColor)
  }

  // root class
  grayMode && updateGrayMode(grayMode)
  colorWeak && updateColorWeak(colorWeak)

  // init locale
  localeStore.initLocale()

  // setup user config
  userStore.setToken(getToken())
}
