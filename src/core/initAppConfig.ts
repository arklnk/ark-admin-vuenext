import { useAppStore } from '/@/stores/modules/app'
import defaultSetting from '/@/settings/projectSetting'

/**
 * Initial project configuration
 */
export function initAppConfigStore() {
  const appStore = useAppStore()

  appStore.setProjectConfig(defaultSetting)
}
