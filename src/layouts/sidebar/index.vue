<template>
  <ElScrollbar height="100%" :wrap-class="d.b()">
    <ElMenu mode="vertical" :default-active="activeMenu">
      <SideMenu v-for="route in routes" :key="route.path" :route="route" />
    </ElMenu>
  </ElScrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useDesign } from '/@/hooks/core/useDesign'
import { basicRoutes } from '/@/router/basicRoutes'
import { usePermissionStore } from '/@/stores/modules/permission'

import SideMenu from './SideMenu.vue'

const d = useDesign('sidebar')

const permissionStore = usePermissionStore()
const routes = computed(() => {
  return permissionStore.getMenuList.concat(basicRoutes).sort((a, b) => (b.meta?.order || 0) - (a.meta?.order || 0))
})

const $route = useRoute()
const activeMenu = computed(() => {
  return $route.path
})

</script>

<style lang="scss">
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

@include b(sidebar) {
  width: var.$sideBarWidth;
}
</style>
