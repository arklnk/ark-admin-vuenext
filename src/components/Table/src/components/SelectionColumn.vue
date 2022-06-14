<template>
  <ElTableColumn :width="columnWidth" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  columnWidth: {
    type: [Number, String] as PropType<string | number>,
    default: 50,
  },
})
</script>
