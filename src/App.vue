<template>
  <ElConfigProvider
    :size="getSize"
    :locale="locale"
    :button="{ autoInsertSpace: getAutoInsertSpace }"
    :message="{ max: getMaxMessage }"
    :z-index="getZIndex"
  >
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { AppProvider } from '/@/components/Application'
import localeZh from 'element-plus/lib/locale/lang/zh-cn'
import { useElementUISetting } from './composables/setting/useElementUISetting'
import { useTitle } from './composables/web/useTitle'

// default zh locale
const locale = localeZh

// ui setting config
const { getSize, getAutoInsertSpace, getZIndex, getMaxMessage } = useElementUISetting()

// page title
useTitle()
</script>
