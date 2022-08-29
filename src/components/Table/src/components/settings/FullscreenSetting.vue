<template>
  <span class="i-majesticons:arrows-collapse-full" @click="toggle" v-if="isFullscreen"></span>
  <span class="i-majesticons:arrows-expand-full" @click="toggle" v-else></span>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

const { isFullscreen, toggle } = useFullscreen(table.wrapRef)
</script>
