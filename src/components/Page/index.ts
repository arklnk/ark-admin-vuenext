import { withInstall } from '/@/utils'

import PageWrapperComp from './src/PageWrapper.vue'
import PageHeaderComp from './src/PageHeader.vue'

export const PageWrapper = withInstall(PageWrapperComp)
export const PageHeader = withInstall(PageHeaderComp)

export const PageWrapperFixedHeightKey = 'PageWrapperFixedHeight'
