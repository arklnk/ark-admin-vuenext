<template>
  <div :class="prefixCls">
    <ElMenu
      class="border-none"
      :mode="menuMode"
      :default-active="activeMenu"
      :unique-opened="getUniqueOpened"
      :collapse="getCollapsed"
      :collapse-transition="false"
    >
      <SideMenuItem v-for="route in routes" :key="route.path" :route="route" />
    </ElMenu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useDesign } from '/@/hooks/core/useDesign'
import { basicRoutes } from '/@/router/basicRoutes'
import { usePermissionStore } from '/@/stores/modules/permission'

import SideMenuItem from './components/SideMenuItem.vue'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'

const props = defineProps({
  isHorizontal: {
    type: Boolean,
    defaule: false
  }
})

const { prefixCls } = useDesign('app-menu')

const permissionStore = usePermissionStore()
const routes = computed(() => {
  return basicRoutes.concat(permissionStore.getMenuList)
})
const $route = useRoute()
const activeMenu = computed(() => {
  return $route.path
})

const { getUniqueOpened, getCollapsed } = useMenuSetting()
const menuMode = computed<'vertical' | 'horizontal'>(() => props.isHorizontal ? 'horizontal' : 'vertical')
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-menu;

.#{$prefixCls} {
  border: none;

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
