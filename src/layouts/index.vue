<template>
  <div class="h-full w-full relative flex flex-row">
    <RouterView />
    <SvgIcon icon="dashboard" spin />
    <BasicMenuItem icon="dashboard" />
  </div>
</template>

<script setup lang="ts">
import BasicMenuItem from './sidebar/BasicMenuItem.vue'
</script>
