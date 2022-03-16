<template>
  <div class="h-full w-full relative flex flex-row">
    <Sidebar />
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './sidebar/index.vue'
</script>
