<template>
  <span @click="handleClick">
    <span class="i-ooui:reload"></span>
  </span>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRedo } from '/@/composables/web/useRedo'

const router = useRouter()

function handleClick() {
  const redo = useRedo(router)
  redo()
}
</script>
