<template>
  <template v-if="!showRoute?.meta?.hidden">
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

const showRoute: ComputedRef<Nullable<RouteRecordRaw>> = computed(() => {
  // 根菜单
  if (!props.route.meta) {
    return props.route.children?.[0]
  }

  // 目录或次级目录
  if (props.route.component?.name === ParentLayout.name || props.route.component?.name === EmptyLayout.name) {
    return null
  }

  // 菜单
  return props.route
})
</script>
