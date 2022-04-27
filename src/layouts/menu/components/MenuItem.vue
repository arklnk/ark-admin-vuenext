<template>
  <template v-if="!route.meta?.hidden">
    <MenuLink v-if="showRoute" :to="showRoute.path">
      <ElMenuItem :index="showRoute.path">
        <ElIcon>
          <SvgIcon v-if="showRoute.meta?.icon" :icon="showRoute.meta.icon" />
        </ElIcon>
        <template #title>
          <span class="ml-2">{{ showRoute.meta?.title }}</span>
        </template>
      </ElMenuItem>
    </MenuLink>
    <ElSubMenu v-else :index="route.path">
      <template #title>
        <ElIcon>
          <SvgIcon v-if="route.meta?.icon" :icon="route.meta.icon" />
        </ElIcon>
        <span class="ml-2">{{ route.meta?.title }}</span>
      </template>
      <MenuItem v-for="child in route.children" :key="child.path" :route="child" />
    </ElSubMenu>
  </template>
</template>

<script lang="ts">
export default {
  name: 'MenuItem'
}
</script>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { ComputedRef } from 'vue'

import { computed, PropType } from 'vue'

import MenuLink from './MenuLink.vue'
import { EmptyLayout, ParentLayout } from '/@/router/contants'

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
