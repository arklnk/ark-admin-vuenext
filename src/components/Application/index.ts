import AppProviderComp from './src/AppProvider.vue'
import AppLogoComp from './src/AppLogo.vue'
import AppDarkModeToggleComp from './src/AppDarkModeToggle.vue'
import { withInstall } from '/@/utils'

export const AppProvider = withInstall(AppProviderComp)
export const AppLogo = withInstall(AppLogoComp)
export const AppDarkModeToggle = withInstall(AppDarkModeToggleComp)
