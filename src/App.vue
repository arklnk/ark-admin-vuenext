<template>
  <ElConfigProvider size="default" :locale="locale">
    <RouterView />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import localeZh from 'element-plus/lib/locale/lang/zh-cn'
const locale = localeZh
</script>
