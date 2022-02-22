import { useAppStore } from '/@/stores/modules/app'
import { useUserStore } from '/@/stores/modules/user'

import defaultSetting from '/@/settings/projectSetting'
import { getToken } from '/@/utils/auth'

/**
 * Initial project configuration
 */
export function initAppConfigStore() {
  const appStore = useAppStore()
  const userStore = useUserStore()

  // setup global config
  appStore.setProjectConfig(defaultSetting)

  // setup user config
  userStore.setToken(getToken())
}
