<template>
  <template v-if="canFullscreen">
    <span @click="handleFullScreen">
      <IconExitFullScreen v-if="fullscreen" /><IconFullScreen v-else />
    </span>
  </template>
  <span @click="handleCancel"><IconClose /></span>
</template>

<script setup lang="ts">
import IconFullScreen from '~icons/radix-icons/enter-full-screen'
import IconExitFullScreen from '~icons/radix-icons/exit-full-screen'
import IconClose from '~icons/clarity/close-line'

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
