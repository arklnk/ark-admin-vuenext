import AppProviderComp from './src/AppProvider.vue'
import AppLinkComp from './src/AppLink.vue'
import AppScreenfullComp from './src/AppScreenfull.vue'
import { withInstall } from '/@/utils'

export const AppProvider = withInstall(AppProviderComp)
export const AppLink = withInstall(AppLinkComp)
export const AppScreenfull = withInstall(AppScreenfullComp)
