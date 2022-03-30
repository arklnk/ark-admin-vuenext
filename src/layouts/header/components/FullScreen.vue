<template>
  <span @click="handleToggleFullScreen" v-if="isSupported">
    <IconFullScreenExit v-if="isFullscreen" />
    <IconFullScreen v-else />
  </span>
</template>

<script setup lang="ts">
import IconFullScreen from '~icons/dashicons/fullscreen-alt'
import IconFullScreenExit from '~icons/dashicons/fullscreen-exit-alt'

import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle: handleToggleFullScreen, isSupported } = useFullscreen()
</script>
