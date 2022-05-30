import { useAppStore } from '/@/stores/modules/app'
import { useUserStore } from '/@/stores/modules/user'

import defaultSetting from '/@/settings/projectSetting'
import { getToken } from '/@/utils/auth'
import { updateTheme } from './theme/updateTheme'
import { updateGrayMode } from './theme/updateGrayMode'
import { updateColorWeak } from './theme/updateColorWeak'
import { updateHeaderBgColor, updateSidebarBgColor } from './theme/updateBackground'
import { KEY_SETTING } from '/@/enums/cacheEnum'
import { ProjectConfig } from '/#/config'
import { merge } from 'lodash-es'
import { updateDarkMode } from './theme/updateDarkMode'
import { ThemeEnum } from '../enums/appEnum'

/**
 * Initial project configuration
 */
export function initAppConfig() {
  const appStore = useAppStore()
  const userStore = useUserStore()

  // setup global config
  try {
    const config = JSON.parse(localStorage.getItem(KEY_SETTING) || '{}') as ProjectConfig
    appStore.setProjectConfig(merge({}, defaultSetting, config))
  } catch (err) {
    appStore.setProjectConfig(defaultSetting)
  }

  const {
    grayMode,
    colorWeak,
    theme,
    themeColor,
    menuSetting: { bgColor },
    headerSetting: { bgColor: headerbgColor },
  } = appStore.getProjectConfig

  // update primary theme color
  updateTheme(themeColor)

  if (theme === ThemeEnum.DARK) {
    // 夜间模式
    updateDarkMode(theme)

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

  // setup user config
  userStore.setToken(getToken())
}
