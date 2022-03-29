<template>
  <IconSettings class="cursor-pointer" @click="handleClick" />
  <ElDrawer v-model="visibleRef" direction="rtl" title="项目配置" :size="300">
    <ElDivider>系统主题</ElDivider>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconSettings from '~icons/prime/cog'

const visibleRef = ref(false)
function handleClick() {
  visibleRef.value = true
}
</script>
