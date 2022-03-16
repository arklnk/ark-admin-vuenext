<template>
  <aside :class="d.b()" class="border-gray-100 border-r">
    <ElScrollbar height="100%">
      <ElMenu class="border-none" mode="vertical" :default-active="activeMenu">
        <SideMenu v-for="route in routes" :key="route.path" :route="route" />
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

import SideMenu from './SideMenu.vue'

const d = useDesign('sidebar')

const permissionStore = usePermissionStore()
const routes = computed(() => {
  return basicRoutes.concat(permissionStore.getMenuList)
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
