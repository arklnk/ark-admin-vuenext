<template>
  <ElTooltip placement="top" content="刷新">
    <IconRiRestartLine @click="redo" />
  </ElTooltip>
</template>

<script setup lang="ts">
import IconRiRestartLine from '~icons/ri/restart-line'
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

function redo() {
  table.reload()
}
</script>
