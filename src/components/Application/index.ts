import AppProviderComp from './src/AppProvider.vue'
import AppLogoComp from './src/AppLogo.vue'
import { withInstall } from '/@/utils'

export const AppProvider = withInstall(AppProviderComp)
export const AppLogo = withInstall(AppLogoComp)
