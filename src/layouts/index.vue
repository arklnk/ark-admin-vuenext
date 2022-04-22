<template>
  <div class="h-full w-full relative flex flex-row overflow-hidden">
    <AppSidebar v-if="isSideBarMode && !getFullContent" />
    <ElScrollbar class="flex-1" :native="false">
      <AppHeader v-if="!getFullContent" />
      <AppMain />
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './sidebar/index.vue'
import AppHeader from './header/index.vue'
import AppMain from './content/MainLayout.vue'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { computed } from 'vue'
import { MenuModeEnum } from '/@/enums/menuEnum'
import { useRootSetting } from '../hooks/setting/useRootSetting'

const { getMenuMode } = useMenuSetting()
const { getFullContent } = useRootSetting()
const isSideBarMode = computed(() => getMenuMode.value === MenuModeEnum.SIDEBAR)
</script>
