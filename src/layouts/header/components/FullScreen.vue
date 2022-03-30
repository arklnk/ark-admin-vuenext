<template>
  <span @click="handleToggleFullScreen" v-if="isSupported">
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
