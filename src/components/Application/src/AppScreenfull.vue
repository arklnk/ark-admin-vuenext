<template>
  <SvgIcon
    :class="isSupported ? 'cursor-pointer' : 'cursor-not-allowed'"
    :icon="icon"
    @click="handleToggleFullScreen"
  />
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { computed, unref } from 'vue'

const { isFullscreen, toggle: handleToggleFullScreen, isSupported } = useFullscreen()

const icon = computed(() => {
  return unref(isFullscreen) ? 'fullscreen-exit' : 'fullscreen'
})
</script>
