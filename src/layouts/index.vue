<template>
  <div class="h-full w-full relative flex flex-row">
    <RouterView />
    <MenuItem icon="dashboard" />
    <SvgIcon icon="a" />
  </div>
</template>

<script setup lang="ts">
import MenuItem from './sidebar/MenuItem.vue'
</script>
