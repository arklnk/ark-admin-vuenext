<template>
  <aside
    :class="[prefixCls, getCollapsed ? 'is-collapsed' : '', isLightBg ? 'light' : '']"
    class="h-full box-border"
  >
    <ElScrollbar>
      <div class="overflow-x-hidden">
        <AppLogo
          v-if="getShowLogo"
          :show-title="!getCollapsed"
          :theme="isLightBg ? 'light' : 'dark'"
          :class="`${prefixCls}__menu-logo`"
        />
        <Menu :is-horizontal="false" />
      </div>
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
  width: var.$sidebar-width;
  background-color: var(--sidebar-bg-color);
  transition: width var.$transition-duration;

  &__menu-logo {
    width: var.$sidebar-width;
    height: var.$header-height;
    padding-left: calc(#{var.$sidebar-collapsed-width} / 2 - 16px);
  }

  @include when(is-collapsed) {
    width: var.$sidebar-collapsed-width;
  }

  @include when(light) {
    border-right: 1px solid var.$border-color-base;
  }
}
</style>
