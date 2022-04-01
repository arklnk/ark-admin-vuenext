import { useAppStore } from '/@/stores/modules/app'
import { useUserStore } from '/@/stores/modules/user'

import defaultSetting from '/@/settings/projectSetting'
import { getToken } from '/@/utils/auth'
import { updateTheme } from './theme/updateTheme'
import { error } from '/@/utils/log'
import { updateGrayMode } from './theme/updateGrayMode'
import { updateColorWeak } from './theme/updateColorWeak'
import { updateSidebarBgColor } from './theme/updateBackground'

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
  } = defaultSetting

  try {
    // update primary theme color
    updateTheme(themeColor)

    grayMode && updateGrayMode(grayMode)
    colorWeak && updateColorWeak(colorWeak)
  } catch (e) {
    error(`${e}`)
  }

  // update background
  bgColor && updateSidebarBgColor(bgColor)

  // setup global config
  appStore.setProjectConfig(defaultSetting)

  // setup user config
  userStore.setToken(getToken())
}
