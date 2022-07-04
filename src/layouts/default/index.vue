<template>
  <div class="h-full w-full relative flex flex-row overflow-hidden">
    <AppFeature />
    <AppSidebar v-if="getShowSideBar" />
    <ElScrollbar class="flex-1" :class="prefixCls" :native="false">
      <AppHeader v-if="getShowHeader" />
      <AppMain />
      <AppFooter />
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './sidebar/index.vue'
import AppHeader from './header/index.vue'
import AppMain from './content/index.vue'
import AppFeature from './feature/index.vue'
import AppFooter from './footer/index.vue'

import { useMenuSetting } from '/@/composables/setting/useMenuSetting'
import { useHeaderSetting } from '/@/composables/setting/useHeaderSetting'
import { useDesign } from '/@/composables/core/useDesign'

const { getShowSideBar } = useMenuSetting()
const { getShowHeader } = useHeaderSetting()

const { prefixCls } = useDesign('layout-default-main')
</script>
