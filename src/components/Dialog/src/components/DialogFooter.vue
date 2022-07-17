<template>
  <slot name="prependFooter"></slot>
  <ElButton>{{ cancelText }}</ElButton>
  <slot name="centerFooter"></slot>
  <ElButton>{{ confirmText }}</ElButton>
  <slot name="appendFooter"></slot>
</template>

<script setup lang="ts">
defineProps({
  confirmText: {
    type: String,
  },
  cancelText: {
    type: String,
  },
})
</script>
