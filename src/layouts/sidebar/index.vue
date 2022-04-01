<template>
  <aside
    :class="[d.b(), d.is('collapsed', getCollapsed), isLightBg ? 'border-r border-gray-100' : '']"
    :style="{ backgroundColor: getBgColor }"
    class="relative h-full box-border"
  >
    <ElScrollbar height="100%">
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

import SideMenuItem from './SideMenuItem.vue'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { isLight } from '/@/utils/color'

const d = useDesign('app-sidebar')

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
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

@include b(app-sidebar) {
  transition: width var.$transitionDuration;
  width: var.$sideBarWidth;

  :deep(.el-menu) {
    --el-menu-item-font-size: 12px;
    --el-menu-item-height: #{var.$navBarHeight};

    --el-menu-text-color: var(--sidebar-menu-text-color);
    --el-menu-hover-text-color: var(--sidebar-menu-hover-text-color);
    --el-menu-bg-color: var(--sidebar-menu-bg-color);

    --el-menu-hover-bg-color: none;
    --el-menu-item-hover-fill: none;

    transition: all var.$transitionDuration;

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

  @include when(collapsed) {
    width: var.$sideBarCollapsedWidth;
  }
}
</style>
