<template>
  <span @click="handleToggleFullScreen" v-if="isSupported">
    <span class="i-dashicons:fullscreen-exit-alt" v-if="isFullscreen"></span>
    <span class="i-dashicons:fullscreen-alt" v-else></span>
  </span>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle: handleToggleFullScreen, isSupported } = useFullscreen()
</script>
