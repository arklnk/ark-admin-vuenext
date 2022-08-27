<template>
  <ElMenu
    :class="getMenuClass"
    class="border-none"
    :style="getTopMenuAlignStyle"
    :mode="getMode"
    :default-active="activeMenu"
    :unique-opened="getUniqueOpened"
    :collapse="getIsCollapsed"
    :collapse-transition="false"
    ellipsis
  >
    <MenuItem v-for="route in routes" :key="route.path" :route="route" />
  </ElMenu>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue'

import { computed, unref } from 'vue'
import { useRoute } from 'vue-router'
import { useDesign } from '/@/composables/core/useDesign'
import { DashboardRoute } from '/@/router/routes/basic'
import { usePermissionStore } from '/@/stores/modules/permission'
import MenuItem from './components/MenuItem.vue'
import { useMenuSetting } from '/@/composables/setting/useMenuSetting'
import { useHeaderSetting } from '/@/composables/setting/useHeaderSetting'

const props = defineProps({
  isHorizontal: {
    type: Boolean,
    defaule: false,
  },
})

const { prefixCls } = useDesign('app-menu')

const permissionStore = usePermissionStore()
const routes = computed(() => {
  // 与显示无关的路由不可关联注册，否则会导致顶部菜单模式时ellipsis计算不正确
  return [DashboardRoute, ...permissionStore.getMenuList]
})

const $route = useRoute()
const activeMenu = computed(() => {
  return $route.meta?.currentActiveMenu || $route.path
})

const { getUniqueOpened, getCollapsed, getMenuTheme, getShowTopMenu, getTopMenuAlign } =
  useMenuSetting()
const { getHeaderTheme } = useHeaderSetting()
const getMode = computed<'vertical' | 'horizontal'>(() =>
  props.isHorizontal ? 'horizontal' : 'vertical'
)

const getMenuClass = computed(() => {
  return [
    prefixCls,
    unref(getMode),
    unref(getMode) === 'vertical' ? getMenuTheme.value : getHeaderTheme.value,
  ]
})

const getIsCollapsed = computed(() => (unref(getShowTopMenu) ? false : unref(getCollapsed)))

// top menu
const getTopMenuAlignStyle = computed((): CSSProperties => {
  return {
    'justify-content': unref(getTopMenuAlign),
  }
})
</script>

<style lang="scss">
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-menu;

$menu-font-size: 12px;
$menu-hover-text-color: #ffffffa6;

.#{$prefixCls} {
  width: 100%;
  .el-sub-menu,
  .el-sub-menu.is-active {
    .el-sub-menu__title {
      border-bottom: none;
    }
  }

  .el-menu-item,
  .el-menu-item.is-active {
    border-bottom: none;
  }

  // 水平菜单，置于Header中
  @include when(horizontal) {
    height: 100%;
    --el-menu-item-font-size: #{$menu-font-size};
    --el-menu-item-height: 100%;
    --el-menu-bg-color: var(--header-bg-color);

    @include when(dark) {
      --el-menu-text-color: #{$menu-hover-text-color};
      --el-menu-hover-text-color: #{var.$color-white};

      --el-menu-hover-bg-color: var(--header-hover-bg-color);
      --el-menu-item-hover-fill: var(--header-hover-bg-color);

      .el-sub-menu,
      .el-sub-menu__title {
        &:hover {
          background-color: var(--el-menu-hover-bg-color);
        }
      }

      .el-menu-item.is-active {
        background-color: var(--el-menu-hover-bg-color);
        color: var(--el-menu-hover-text-color) !important;
      }

      .el-sub-menu.is-active {
        background-color: var(--el-menu-hover-bg-color);

        .el-sub-menu__title {
          color: var(--el-menu-hover-text-color);
        }
      }
    }

    @include when(light) {
      --el-menu-text-color: #{var.$color-black};
      --el-menu-hover-text-color: var(--el-color-primary);

      --el-menu-hover-bg-color: none;
      --el-menu-item-hover-fill: none;

      .el-menu-item:hover,
      .el-menu-item.is-active {
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: var(--el-menu-base-level-padding);
          right: var(--el-menu-base-level-padding);
          height: 2px;
          background-color: var(--el-color-primary);
        }
      }

      .el-sub-menu:hover,
      .el-sub-menu.is-active {
        .el-sub-menu__title {
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: var(--el-menu-base-level-padding);
            right: var(--el-menu-base-level-padding);
            height: 2px;
            background-color: var(--el-color-primary);
          }
        }
      }
    }
  }

  // 垂直菜单， 置于Sidebar中
  @include when(vertical) {
    --el-menu-item-font-size: #{$menu-font-size};
    --el-menu-item-height: #{var.$header-height};
    --el-menu-bg-color: var(--sidebar-bg-color);

    --el-menu-hover-bg-color: none;
    --el-menu-item-hover-fill: none;

    &.el-menu--collapse {
      width: 100%;

      .el-menu-item.is-active,
      .el-sub-menu.is-active {
        &::after {
          position: absolute;
          content: '';
          background-color: var(--el-color-primary);
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
        }
      }
    }

    @include when(light) {
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
          background-color: none;
          color: var(--el-menu-hover-text-color);
        }
      }

      &.el-menu--collapse {
        .el-sub-menu.is-active {
          .el-sub-menu__title {
            background-color: var(--el-color-primary-light-9);
          }
        }
      }

      &:not(.el-menu--collapse) {
        .el-menu-item.is-active {
          &::after {
            position: absolute;
            content: '';
            background-color: var(--el-color-primary);
            top: 0;
            right: 0;
            width: 3px;
            height: 100%;
          }
        }
      }
    }

    @include when(dark) {
      --el-menu-text-color: #{var.$color-white};
      --el-menu-hover-text-color: #{$menu-hover-text-color};

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

      &.el-menu--collapse {
        .el-menu-item.is-active {
          background-color: var(--sidebar-darken-bg-color);
        }

        .el-sub-menu.is-active {
          .el-sub-menu__title {
            background-color: var(--sidebar-darken-bg-color);
          }
        }
      }
    }
  }
}
</style>
