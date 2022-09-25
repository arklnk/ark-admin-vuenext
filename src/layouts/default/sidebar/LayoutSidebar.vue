<template>
  <aside :style="getWrapStyle" :class="getWrapClass">
    <AppLogo
      v-if="getShowLogo"
      :show-title="!getCollapsed"
      :theme="getMenuTheme"
      :class="`${prefixCls}__menu-logo`"
    />

    <ElScrollbar class="flex-1">
      <Menu :is-horizontal="false" />
    </ElScrollbar>

    <MenuTrigger
      v-if="getShowSidebarTrigger && !getIsMobile"
      :collapsed="getCollapsed"
      :class="`${prefixCls}__menu-trigger`"
      @click="toggleCollapse"
    />
  </aside>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { useDesign } from '/@/composables/core/useDesign'
import { AppLogo } from '/@/components/Application'
import { useMenuSetting } from '/@/composables/setting/useMenuSetting'
import { useRootSetting } from '/@/composables/setting/useRootSetting'
import Menu from '../menu/index.vue'
import MenuTrigger from '../menu/components/Trigger.vue'
import { computed, unref } from 'vue'
import { useAppInject } from '/@/composables/core/useAppInject'

const { prefixCls } = useDesign('app-sidebar')
const { getIsMobile } = useAppInject()

const { getCollapsed, getMenuTheme, getRealWidth, getShowSidebarTrigger, toggleCollapse } =
  useMenuSetting()
const { getShowLogo } = useRootSetting()
const getWrapStyle = computed((): CSSProperties => {
  return {
    width: `${unref(getRealWidth)}px`,
  }
})
const getWrapClass = computed(() => [prefixCls, unref(getMenuTheme)])
</script>

<style lang="scss">
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-sidebar;

.#{$prefixCls} {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: var(--sidebar-bg-color);
  transition: width var.$transition-duration;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  z-index: 10;

  &__menu-logo {
    height: var.$header-height;
    padding: 10px 4px 10px 16px;
  }

  &__menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 32px;
    font-size: 14px;
    background-color: var(--sidebar-bg-color);
    border-top: 1px solid rgb(238, 238, 238);
    color: var.$color-black;

    &:hover {
      opacity: 0.6;
    }
  }

  @include when(dark) {
    box-shadow: rgba(13, 13, 13, 0.65) 0px 2px 8px 0px;

    .#{$prefixCls}__menu-trigger {
      border: none;
      color: var.$color-white;
    }
  }
}
</style>
