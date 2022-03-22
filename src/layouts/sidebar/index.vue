<template>
  <aside
    :class="[d.b(), d.is('stand', true)]"
    class="relative border-gray-100 border-r h-full bg-white box-border"
  >
    <ElScrollbar height="100%">
      <ElMenu class="border-none" mode="vertical" :default-active="activeMenu">
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

const d = useDesign('app-sidebar')

const permissionStore = usePermissionStore()
const routes = computed(() => {
  return basicRoutes.concat(permissionStore.getMenuList)
})


const $route = useRoute()
const activeMenu = computed(() => {
  return $route.path
})
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

@include b(app-sidebar) {
  @include when(stand) {
    width: var.$sideBarWidth;
  }
}
</style>
