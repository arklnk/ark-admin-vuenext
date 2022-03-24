<template>
  <template v-if="!route.meta?.hidden">
    <AppLink v-if="showRoute" :to="showRoute.path">
      <ElMenuItem :index="showRoute.path">
        <ElIcon>
          <SvgIcon v-if="showRoute.meta?.icon" :icon="showRoute.meta.icon" />
        </ElIcon>
        <template #title>
          <span class="ml-2">{{ showRoute.meta?.title }}</span>
        </template>
      </ElMenuItem>
    </AppLink>
    <ElSubMenu v-else :index="route.path">
      <template #title>
        <ElIcon>
          <SvgIcon v-if="route.meta?.icon" :icon="route.meta.icon" />
        </ElIcon>
        <span class="ml-2">{{ route.meta?.title }}</span>
      </template>
      <SideMenuItem v-for="child in route.children" :key="child.path" :route="child" />
    </ElSubMenu>
  </template>
</template>

<script lang="ts">
export default {
  name: 'SideMenuItem'
}
</script>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { ComputedRef } from 'vue'

import { computed, PropType } from 'vue'

import { AppLink } from '/@/components/Application'
import { EmptyLayout, ParentLayout } from '/@/router/basicRoutes'

const props = defineProps({
  route: {
    type: Object as PropType<RouteRecordRaw>,
    required: true
  }
})

/**
 * 渲染菜单或者目录
 */
const showRoute: ComputedRef<RouteRecordRaw | null> = computed(() => {
  return (props.route.component?.name === ParentLayout.name || props.route.component?.name === EmptyLayout.name)
    ? null : props.route
})
</script>
