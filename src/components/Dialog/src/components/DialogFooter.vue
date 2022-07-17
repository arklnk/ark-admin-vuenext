<template>
  <slot name="prependFooter"></slot>
  <ElButton @click="handleCancel">{{ cancelText }}</ElButton>
  <slot name="centerFooter"></slot>
  <ElButton @click="handleConfirm">{{ confirmText }}</ElButton>
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

const emit = defineEmits(['cancel', 'confirm']) 

function handleCancel() {
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>
