<template>
  <ElConfigProvider v-bind="getElConfig">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { AppProvider } from '/@/components/Application'
import { useTitle } from './composables/web/useTitle'
import ProjectConfig from './settings/projectSetting'
import { computed, unref } from 'vue'

import { useLocale } from './locales/useLocale'
import { dateUtil } from './utils/date'

const { getEleLocale, getDayjsLocale } = useLocale()

const getElConfig = computed(() => {
  // dayjs locale
  dateUtil.locale(unref(getDayjsLocale))

  return {
    ...ProjectConfig.elementUISetting,
    locale: unref(getEleLocale),
  }
})

// page title
useTitle()
</script>
