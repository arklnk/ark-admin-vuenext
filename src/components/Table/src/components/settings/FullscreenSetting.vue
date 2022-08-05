<template>
  <ElTooltip content="全屏内容" placement="top">
    <IconParkOffScreenTwo @click="toggle" v-if="isFullscreen" />
    <IconParkFullScreenTwo @click="toggle" v-else />
  </ElTooltip>
</template>

<script setup lang="ts">
import IconParkOffScreenTwo from '~icons/icon-park/off-screen-two'
import IconParkFullScreenTwo from '~icons/icon-park/full-screen-two'
import { useFullscreen } from '@vueuse/core'
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

const { isFullscreen, toggle } = useFullscreen(table.wrapRef)
</script>
