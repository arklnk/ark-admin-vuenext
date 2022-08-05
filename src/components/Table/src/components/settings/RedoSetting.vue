<template>
  <ElTooltip placement="top" content="刷新">
    <IconParkRefresh @click="redo" />
  </ElTooltip>
</template>

<script setup lang="ts">
import IconParkRefresh from '~icons/icon-park/refresh'
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

function redo() {
  table.reload()
}
</script>
