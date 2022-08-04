<template>
  <ElTooltip content="全屏" placement="top">
    <IconRiFullscreenExitFill @click="toggle" v-if="isFullscreen" />
    <IconRiFullscreenFill @click="toggle" v-else />
  </ElTooltip>
</template>

<script setup lang="ts">
import IconRiFullscreenExitFill from '~icons/ri/fullscreen-exit-fill'
import IconRiFullscreenFill from '~icons/ri/fullscreen-fill'
import { useFullscreen } from '@vueuse/core'
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

const { isFullscreen, toggle } = useFullscreen(table.wrapRef)
</script>
