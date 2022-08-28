<template>
  <span class="i-mdi:restore" @click="redo"></span>
</template>

<script setup lang="ts">
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

function redo() {
  table.reload()
}
</script>
