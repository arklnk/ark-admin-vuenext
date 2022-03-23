<template>
  <aside
    :class="[d.b(), d.is('collapsed', getCollapsed)]"
    class="relative border-gray-100 border-r h-full bg-white box-border"
  >
    <ElScrollbar height="100%">
      <ElMenu
        class="border-none"
        mode="vertical"
        :default-active="activeMenu"
        :unique-opened="getUniqueOpened"
        :collapse="getCollapsed"
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

const d = useDesign('app-sidebar')

const permissionStore = usePermissionStore()
const routes = computed(() => {
  return basicRoutes.concat(permissionStore.getMenuList)
})
const $route = useRoute()
const activeMenu = computed(() => {
  return $route.path
})

const { getUniqueOpened, getCollapsed } = useMenuSetting()
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

@include b(app-sidebar) {
  transition: width 0.3s;
  width: var.$sideBarWidth;

  @include when(collapsed) {
    width: var.$sideBarCollapsedWidth;

    :deep(.el-menu--collapse) {
      width: var.$sideBarCollapsedWidth;
    }
  }
}
</style>
