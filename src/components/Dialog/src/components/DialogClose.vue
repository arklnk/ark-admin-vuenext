<template>
  <template v-if="canFullscreen">
    <span @click="handleFullScreen">
      <span class="i-radix-icons:minus" v-if="fullscreen"></span>
      <span class="i-radix-icons:enter-full-screen" v-else></span>
    </span>
  </template>
  <span class="i-radix-icons:cross-2" @click="handleCancel"></span>
</template>

<script setup lang="ts">
defineProps({
  canFullscreen: {
    type: Boolean,
    default: true,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel', 'fullscreen'])

function handleFullScreen(e: Event) {
  e?.stopPropagation()
  e?.preventDefault()
  emit('fullscreen')
}

function handleCancel(e: Event) {
  e?.stopPropagation()
  e?.preventDefault()
  emit('cancel')
}
</script>
