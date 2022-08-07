<template>
  <ElTooltip content="全屏内容" placement="top">
    <IconMajesticonsArrowsCollapseFull @click="toggle" v-if="isFullscreen" />
    <IconMajesticonsArrowsExpandFull @click="toggle" v-else />
  </ElTooltip>
</template>

<script setup lang="ts">
import IconMajesticonsArrowsCollapseFull from '~icons/majesticons/arrows-collapse-full'
import IconMajesticonsArrowsExpandFull from '~icons/majesticons/arrows-expand-full'
import { useFullscreen } from '@vueuse/core'
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

const { isFullscreen, toggle } = useFullscreen(table.wrapRef)
</script>
