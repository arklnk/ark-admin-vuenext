<template>
  <template v-if="!route.meta?.hidden">
    <AppLink v-if="showRoute" :to="showRoute.path">
      <ElMenuItem :index="showRoute.path">
        <BasicMenuItem :icon="showRoute.meta?.icon" :title="showRoute.meta?.title" />
      </ElMenuItem>
    </AppLink>
    <ElSubMenu v-else :index="route.path">
      <template #title>
        <BasicMenuItem :icon="route.meta?.icon" :title="route.meta?.title" />
      </template>
      <SideMenu v-for="child in route.children" :key="child.path" :route="child" />
    </ElSubMenu>
  </template>
</template>

<script lang="ts">
export default {
  name: 'SideMenu'
}
</script>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { ComputedRef } from 'vue'

import { computed, PropType } from 'vue'

import BasicMenuItem from './BasicMenuItem.vue'
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
  const showingChildren = props.route.children?.filter(item => !item.meta?.hidden) || []
  // 菜单
  if (showingChildren.length === 1) {
    return props.route.meta ? null : showingChildren[0]
  }

  // 判断是否需要渲染成目录
  if (showingChildren.length === 0) {
    return (props.route.component?.name === ParentLayout.name || props.route.component?.name === EmptyLayout.name)
      ? null : props.route
  }

  return null
})
</script>
