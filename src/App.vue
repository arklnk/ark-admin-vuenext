<template>
  <ElConfigProvider size="default" :locale="locale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ElConfigProvider>
</template>

<script setup lang="ts">
import { AppProvider } from '/@/components/Application'
import localeZh from 'element-plus/lib/locale/lang/zh-cn'
const locale = localeZh
</script>
