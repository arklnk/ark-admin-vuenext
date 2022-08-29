<template>
  <ElMenuItem
    v-if="!menuHasChildren(getRoute) && getShowMenu"
    :index="getRoute.path"
    @click="handleMenuClick"
  >
    <!-- do not use el-icon wrap -->
    <i
      class="text-lg flex-shrink-0"
      v-if="getRoute.meta?.icon"
      :class="`i-${getRoute.meta.icon}`"
    ></i>
    <template #title>
      <span class="ml-4">{{ t(getRoute.meta?.title!) }}</span>
    </template>
  </ElMenuItem>
  <ElSubMenu v-else-if="menuHasChildren(getRoute) && getShowMenu" :index="getRoute.path">
    <template #title>
      <!-- do not use el-icon wrap -->
      <i
        class="text-lg flex-shrink-0"
        v-if="getRoute.meta?.icon"
        :class="`i-${getRoute.meta.icon}`"
      ></i>
      <span class="ml-4">{{ t(getRoute.meta?.title!) }}</span>
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
import type { MenuItemRegistered } from 'element-plus/lib/components/menu/src/types'

import { computed, unref } from 'vue'
import { isUrl } from '/@/utils/is'
import { openWindow } from '/@/utils'
import { useGo } from '/@/composables/web/useGo'
import { useTransl } from '/@/composables/core/useTransl'

const { t } = useTransl()

const props = defineProps({
  route: {
    type: Object as PropType<RouteRecordRaw>,
    required: true,
  },
})

const getRoute = computed(() => (props.route.meta?.single ? props.route.children![0] : props.route))

const getShowMenu = computed(() => !unref(getRoute).meta?.hidden)

function menuHasChildren(route: RouteRecordRaw): boolean {
  // NOTE: 如果目录下没有子菜单或者子目录，则会被渲染成菜单
  return Reflect.has(route, 'children') && !!route.children && route.children.length > 0
}

const go = useGo()

function handleMenuClick({ index }: MenuItemRegistered) {
  if (isUrl(index)) {
    openWindow(index)
  } else {
    go(index)
  }
}
</script>
