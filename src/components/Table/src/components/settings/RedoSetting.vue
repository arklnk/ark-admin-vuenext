<template>
  <ElTooltip placement="top" content="刷新">
    <IconMdiRestore @click="redo" />
  </ElTooltip>
</template>

<script setup lang="ts">
import IconMdiRestore from '~icons/mdi/restore'
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

function redo() {
  table.reload()
}
</script>
