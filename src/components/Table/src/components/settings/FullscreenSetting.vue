<template>
  <IconMajesticonsArrowsCollapseFull @click="toggle" v-if="isFullscreen" />
  <IconMajesticonsArrowsExpandFull @click="toggle" v-else />
</template>

<script setup lang="ts">
import IconMajesticonsArrowsCollapseFull from '~icons/majesticons/arrows-collapse-full'
import IconMajesticonsArrowsExpandFull from '~icons/majesticons/arrows-expand-full'
import { useFullscreen } from '@vueuse/core'
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

const { isFullscreen, toggle } = useFullscreen(table.wrapRef)
</script>
