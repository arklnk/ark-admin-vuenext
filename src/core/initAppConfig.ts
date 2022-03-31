import { useAppStore } from '/@/stores/modules/app'
import { useUserStore } from '/@/stores/modules/user'

import defaultSetting from '/@/settings/projectSetting'
import { getToken } from '/@/utils/auth'
import { updateTheme } from './theme/updateTheme'
import { error } from '/@/utils/log'
import { updateGrayMode } from './theme/updateGrayMode'
import { updateColorWeak } from './theme/updateColorWeak'

/**
 * Initial project configuration
 */
export function initAppConfig() {
  const appStore = useAppStore()
  const userStore = useUserStore()

  const { grayMode, colorWeak, themeColor } = defaultSetting

  try {
    // update primary theme color
    updateTheme(themeColor)

    grayMode && updateGrayMode(grayMode)
    colorWeak && updateColorWeak(colorWeak)
  } catch (e) {
    error(`${e}`)
  }

  // setup global config
  appStore.setProjectConfig(defaultSetting)

  // setup user config
  userStore.setToken(getToken())
}
