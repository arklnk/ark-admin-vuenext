<template>
  <div class="w-full h-full relative flex flex-row overflow-hidden" :class="prefixCls">
    <AppFeature />
    <AppSidebar v-if="getShowSideBar || getIsMobile" />
    <div class="flex-1 overflow-hidden overflow-y-auto" :class="`${prefixCls}-main`">
      <AppHeader v-if="getShowHeader" />
      <AppMain />
      <AppFooter />
    </div>
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
import { useAppInject } from '/@/composables/core/useAppInject'

const { getShowSideBar } = useMenuSetting()
const { getShowHeader } = useHeaderSetting()

const { getIsMobile } = useAppInject()

// 用于el-backtop查找元素
const { prefixCls } = useDesign('layout-default')
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-layout-default;

.#{$prefixCls} {
  background-color: var.$app-bg-color;

  &-main {
    min-height: 100%;
  }
}

html.dark {
  .#{$prefixCls} {
    background-color: var.$app-dark-bg-color;
  }
}
</style>
