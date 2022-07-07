<template>
  <aside :style="getWrapperStyle" :class="[prefixCls, getMenuTheme]" class="h-full box-border flex flex-col">
    <AppLogo
      v-if="getShowLogo"
      :show-title="!getCollapsed"
      :theme="getMenuTheme"
      :class="`${prefixCls}__menu-logo`"
    />
    <ElScrollbar class="flex-1">
      <Menu :is-horizontal="false" />
    </ElScrollbar>
  </aside>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { useDesign } from '/@/composables/core/useDesign'
import { AppLogo } from '/@/components/Application'
import { useMenuSetting } from '/@/composables/setting/useMenuSetting'
import { useRootSetting } from '/@/composables/setting/useRootSetting'
import Menu from '../menu/index.vue'
import { computed, unref } from 'vue'

const { prefixCls } = useDesign('app-sidebar')
const { getCollapsed, getMenuTheme, getRealWidth } = useMenuSetting()
const { getShowLogo } = useRootSetting()
const getWrapperStyle = computed((): CSSProperties => {
  return {
    width: `${unref(getRealWidth)}px`,
  }
})
</script>

<style lang="scss">
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-sidebar;

.#{$prefixCls} {
  background-color: var(--sidebar-bg-color);
  transition: width var.$transition-duration;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  z-index: 10;

  &__menu-logo {
    height: var.$header-height;
    padding: 10px 4px 10px 16px;
  }

  @include when(dark) {
    box-shadow: rgba(13, 13, 13, 0.65) 0px 2px 8px 0px;
  }
}
</style>
