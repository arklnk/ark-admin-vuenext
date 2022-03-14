<template>
  <template v-if="!route.meta?.hidden">
    <template v-if="hasOneShowingChild(route.children)">
      <ElMenuItem :index="route.path">
        <BasicMenuItem :icon="route.meta?.icon" :title="route.meta?.title" />
      </ElMenuItem>
    </template>
    <template v-else>
      <ElSubMenu :index="route.path">
        <template #title>
          <BasicMenuItem :icon="route.meta?.icon" :title="route.meta?.title" />
        </template>
        <SideMenu v-for="child in route.children" :key="child.path" :route="child" />
      </ElSubMenu>
    </template>
  </template>
</template>

<script lang="ts">
export default {
  name: 'SideMenu'
}
</script>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { PropType } from 'vue'

import BasicMenuItem from './BasicMenuItem.vue'

defineProps({
  route: {
    type: Object as PropType<RouteRecordRaw>,
    required: true
  }
})

function hasOneShowingChild(child: RouteRecordRaw[] = []): boolean {
  const showingChild = child.filter(c => !c.meta?.hidden)
  return showingChild.length <= 1
}
</script>
