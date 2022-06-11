<template>
  <aside
    :class="[prefixCls, getCollapsed ? 'is-collapsed' : '', getMenuTheme]"
    class="h-full box-border"
  >
    <ElScrollbar>
      <div class="overflow-x-hidden">
        <AppLogo
          v-if="getShowLogo"
          :show-title="!getCollapsed"
          :theme="getMenuTheme"
          :class="`${prefixCls}__menu-logo`"
        />
        <Menu :is-horizontal="false" />
      </div>
    </ElScrollbar>
  </aside>
</template>

<script setup lang="ts">
import { useDesign } from '/@/composables/core/useDesign'
import { AppLogo } from '/@/components/Application'
import { useMenuSetting } from '/@/composables/setting/useMenuSetting'
import { useRootSetting } from '/@/composables/setting/useRootSetting'

import Menu from '../menu/index.vue'

const { prefixCls } = useDesign('app-sidebar')

const { getCollapsed, getMenuTheme } = useMenuSetting()

const { getShowLogo } = useRootSetting()
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-sidebar;

.#{$prefixCls} {
  width: var.$sidebar-width;
  background-color: var(--sidebar-bg-color);
  transition: width var.$transition-duration;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  z-index: 10;

  &__menu-logo {
    width: var.$sidebar-width;
    height: var.$header-height;
    padding-left: calc(#{var.$sidebar-collapsed-width} / 2 - 16px);
  }

  @include when(is-collapsed) {
    width: var.$sidebar-collapsed-width;
  }

  @include when(dark) {
    box-shadow: rgba(13, 13, 13, 0.65) 0px 2px 8px 0px;
  }
}
</style>
