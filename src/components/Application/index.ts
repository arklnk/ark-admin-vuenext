import AppProviderComp from './src/AppProvider.vue'
import AppLinkComp from './src/AppLink.vue'
import AppLogoComp from './src/AppLogo.vue'
import { withInstall } from '/@/utils'

export const AppProvider = withInstall(AppProviderComp)
export const AppLink = withInstall(AppLinkComp)
export const AppLogo = withInstall(AppLogoComp)
