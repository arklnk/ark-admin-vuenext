import { useAppStore } from '/@/stores/modules/app'
import { useUserStore } from '/@/stores/modules/user'

import defaultSetting from '/@/settings/projectSetting'
import { getToken } from '/@/utils/auth'
import { updateTheme } from './theme/updateTheme'
import { updateGrayMode } from './theme/updateGrayMode'
import { updateColorWeak } from './theme/updateColorWeak'
import { updateHeaderBgColor, updateSidebarBgColor } from './theme/updateBackground'

/**
 * Initial project configuration
 */
export function initAppConfig() {
  const appStore = useAppStore()
  const userStore = useUserStore()

  const {
    grayMode,
    colorWeak,
    themeColor,
    menuSetting: { bgColor },
    headerSetting: { bgColor: headerbgColor },
  } = defaultSetting

  // update primary theme color
  updateTheme(themeColor)

  // root class
  grayMode && updateGrayMode(grayMode)
  colorWeak && updateColorWeak(colorWeak)

  // update background
  bgColor && updateSidebarBgColor(bgColor)
  headerbgColor && updateHeaderBgColor(headerbgColor)

  // setup global config
  appStore.setProjectConfig(defaultSetting)

  // setup user config
  userStore.setToken(getToken())
}
