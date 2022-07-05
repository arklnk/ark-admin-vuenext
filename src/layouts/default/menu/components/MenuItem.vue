<template>
  <ElMenuItem v-if="!menuHasChildren(getRoute) && getShowMenu" :index="getRoute.path" @click="handleMenuClick">
    <ElIcon>
      <SvgIcon v-if="getRoute.meta?.icon" :icon="getRoute.meta.icon" />
    </ElIcon>
    <template #title>
      <span class="ml-2">{{ getRoute.meta?.title }}</span>
    </template>
  </ElMenuItem>
  <ElSubMenu v-if="menuHasChildren(getRoute) && getShowMenu" :index="getRoute.path">
    <template #title>
      <ElIcon>
        <SvgIcon v-if="getRoute.meta?.icon" :icon="getRoute.meta.icon" />
      </ElIcon>
      <span class="ml-2">{{ getRoute.meta?.title }}</span>
    </template>
    <MenuItem v-for="child in getRoute.children" :key="child.path" :route="child" />
  </ElSubMenu>
</template>

<script lang="ts">
export default {
  name: 'MenuItem',
}
</script>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { PropType } from 'vue'

import { computed, unref } from 'vue'

const props = defineProps({
  route: {
    type: Object as PropType<RouteRecordRaw>,
    required: true,
  },
})

const getRoute = computed(() => (props.route.meta?.single ? props.route.children![0] : props.route))

const getShowMenu = computed(() => !unref(getRoute).meta?.hidden)

function menuHasChildren(route: RouteRecordRaw): boolean {
  return Reflect.has(route, 'children') && !!route.children && route.children.length > 0
}

function handleMenuClick(params) {
  console.log(params)
}
</script>
