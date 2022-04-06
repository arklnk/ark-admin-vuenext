<template>
  <div
    class="h-full w-full relative flex flex-row overflow-hidden"
    style="background-color: #fafafb;"
  >
    <AppSidebar />
    <section class="flex-1 relative overflow-auto">
      <AppHeader />
      <AppMain />
    </section>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './sidebar/index.vue'
import AppHeader from './header/index.vue'
import AppMain from './content/MainLayout.vue'
</script>
