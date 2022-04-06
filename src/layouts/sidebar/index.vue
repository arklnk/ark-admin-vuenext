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
      <ElMenu
        class="border-none"
        mode="vertical"
        :default-active="activeMenu"
        :unique-opened="getUniqueOpened"
        :collapse="getCollapsed"
        :collapse-transition="false"
      >
        <SideMenuItem v-for="route in routes" :key="route.path" :route="route" />
      </ElMenu>
    </ElScrollbar>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useDesign } from '/@/hooks/core/useDesign'
import { basicRoutes } from '/@/router/basicRoutes'
import { usePermissionStore } from '/@/stores/modules/permission'

import SideMenuItem from './components/SideMenuItem.vue'
import { AppLogo } from '/@/components/Application'

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { isLight } from '/@/utils/color'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'

const { prefixCls } = useDesign('app-sidebar')

const permissionStore = usePermissionStore()
const routes = computed(() => {
  return basicRoutes.concat(permissionStore.getMenuList)
})
const $route = useRoute()
const activeMenu = computed(() => {
  return $route.path
})

const { getUniqueOpened, getCollapsed, getBgColor } = useMenuSetting()
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

  :deep(.el-menu) {
    --el-menu-item-font-size: 12px;
    --el-menu-item-height: #{var.$navBarHeight};

    --el-menu-text-color: var(--sidebar-menu-text-color);
    --el-menu-hover-text-color: var(--sidebar-menu-hover-text-color);
    --el-menu-bg-color: var(--sidebar-menu-bg-color);

    --el-menu-hover-bg-color: none;
    --el-menu-item-hover-fill: none;

    .el-menu--collapse {
      width: var.$sideBarCollapsedWidth;
    }

    .el-sub-menu .el-sub-menu,
    .el-menu .el-menu-item {
      background-color: var(--sidebar-submenu-bg-color);
    }

    .el-menu-item,
    .el-sub-menu,
    .el-sub-menu__title {
      &:hover {
        background-color: none !important;
        color: var(--sidebar-menu-hover-text-color);
      }
    }

    .el-menu-item.is-active {
      background-color: var(--sidebar-menu-active-bg-color);
      color: var(--sidebar-menu-active-text-color);
    }
  }
}
</style>
