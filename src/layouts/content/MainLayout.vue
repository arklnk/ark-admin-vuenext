<template>
  <main class="relative">
    <RouterView v-if="reloadFlag" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const reloadFlag = ref(true)
</script>
