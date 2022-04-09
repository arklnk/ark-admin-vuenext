<template>
  <aside
    :class="[prefixCls, getCollapsed ? 'is-collapsed' : '', isLightBg ? 'light' : '']"
    class="h-full box-border relative overflow-hidden"
  >
    <ElScrollbar height="100%">
      <AppLogo
        v-if="getShowLogo"
        :show-title="!getCollapsed"
        :theme="isLightBg ? 'light' : 'dark'"
        :class="`${prefixCls}__menu-logo`"
      />
      <Menu :is-horizontal="false" />
    </ElScrollbar>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useDesign } from '/@/hooks/core/useDesign'

import { AppLogo } from '/@/components/Application'

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { isLight } from '/@/utils/color'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import Menu from '../menu/index.vue'

const { prefixCls } = useDesign('app-sidebar')

const { getCollapsed, getBgColor } = useMenuSetting()
const isLightBg = computed(() => isLight(getBgColor.value))

const { getShowLogo } = useRootSetting()
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-sidebar;

.#{$prefixCls} {
  width: var.$sideBarWidth;
  background-color: var(--sidebar-menu-bg-color);
  transition: width var.$transitionDuration;

  &__menu-logo {
    width: var.$sideBarWidth;
    height: var.$navBarHeight;
  }

  @include when(is-collapsed) {
    width: var.$sideBarCollapsedWidth;
  }

  @include when(light) {
    border-right: 1px solid var.$border-color-base;
  }
}
</style>
