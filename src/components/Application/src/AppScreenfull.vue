<template>
  <span
    @click="handleToggleFullScreen"
    :class="isSupported ? 'cursor-pointer' : 'cursor-not-allowed'"
  >
    <IconFullScreenExit v-if="isFullscreen" />
    <IconFullScreen v-else />
  </span>
</template>

<script setup lang="ts">
import IconFullScreen from '~icons/mdi/fullscreen'
import IconFullScreenExit from '~icons/mdi/fullscreen-exit'

import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle: handleToggleFullScreen, isSupported } = useFullscreen()
</script>
