<template>
  <ElConfigProvider v-bind="getElConfig">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { AppProvider } from '/@/components/Application'
import localeZh from 'element-plus/lib/locale/lang/zh-cn'
import { useTitle } from './composables/web/useTitle'
import ProjectConfig from './settings/projectSetting'
import { computed } from 'vue'

// dayjs lacale
import 'dayjs/locale/zh-cn'

// default zh locale
const getElConfig = computed(() => {
  return {
    ...ProjectConfig.elementUISetting,
    locale: localeZh,
  }
})

// page title
useTitle()
</script>
