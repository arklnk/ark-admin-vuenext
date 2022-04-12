<template>
  <div :class="[prefixCls, menuMode, getLightOrDarkClass]">
    <ElMenu
      class="border-none" :mode="menuMode" :default-active="activeMenu" :unique-opened="getUniqueOpened"
      :collapse="getCollapsed" :collapse-transition="false">
      <SideMenuItem v-for="route in routes" :key="route.path" :route="route" />
    </ElMenu>
  </div>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import { useRoute } from 'vue-router'

import { useDesign } from '/@/hooks/core/useDesign'
import { basicRoutes } from '/@/router/basicRoutes'
import { usePermissionStore } from '/@/stores/modules/permission'

import SideMenuItem from './components/SideMenuItem.vue'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { isLight } from '/@/utils/color'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'

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

const { getUniqueOpened, getCollapsed, getBgColor: getSideBgColor } = useMenuSetting()
const { getBgColor: getHeaderBgColor } = useHeaderSetting()
const menuMode = computed<'vertical' | 'horizontal'>(() => props.isHorizontal ? 'horizontal' : 'vertical')

const getLightOrDarkClass = computed<'light' | 'dark'>(() => {
  const bgColor = unref(menuMode) === 'vertical' ? unref(getSideBgColor) : unref(getHeaderBgColor)
  return isLight(bgColor) ? 'light' : 'dark'
})
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss'as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-menu;

$menu-font-size: 12px;
$menu-light-text-hover-color: #b3b3b3;

.#{$prefixCls} {

  // 水平菜单，置于Header中
  @include when(horizontal) {
    :deep(.el-menu) {
      --el-menu-item-font-size: #{$menu-font-size};
      --el-menu-item-height: calc(#{var.$header-height} - 1px);
    }
  }

  // 垂直菜单， 置于Sidebar中
  @include when(vertical) {
    :deep(.el-menu) {
      --el-menu-item-font-size: #{$menu-font-size};
      --el-menu-item-height: #{var.$header-height};
      --el-menu-bg-color: var(--sidebar-bg-color);

      --el-menu-hover-bg-color: none;
      --el-menu-item-hover-fill: none;

      .el-menu--collapse {
        width: var.$sidebar-collapsed-width;
      }
    }

    @include when(light) {
      :deep(.el-menu) {
        --el-menu-text-color: #{var.$color-black};
        --el-menu-hover-text-color: var(--el-color-primary);

        .el-menu-item.is-active {
          background-color: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }

        .el-menu-item,
        .el-sub-menu,
        .el-sub-menu__title {
          &:hover {
            background-color: none !important;
            color: var(--el-menu-hover-text-color);
          }
        }
      }
    }

    @include when(dark) {
      :deep(.el-menu) {
        --el-menu-text-color: #{var.$color-white};
        --el-menu-hover-text-color: #{$menu-light-text-hover-color};

        .el-sub-menu .el-sub-menu,
        .el-menu .el-menu-item {
          background-color: var(--sidebar-darken-bg-color);
        }

        .el-menu-item,
        .el-sub-menu,
        .el-sub-menu__title {
          &:hover {
            background-color: none !important;
            color: var(--el-menu-hover-text-color);
          }
        }

        .el-menu-item.is-active {
          background-color: var(--el-color-primary);
          color: var.$color-white;
        }
      }
    }
  }
}
</style>
