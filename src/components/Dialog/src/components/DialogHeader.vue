<template>
  <div class="flex flex-row items-center">
    {{ title }}
    <ElTooltip v-if="helpMessage" :content="helpMessage">
      <span class="ml-2"></span>
    </ElTooltip>
  </div>
</template>

<script setup lang="ts">
defineProps({
  helpMessage: {
    type: String,
    default: 'helpMessage',
  },
  title: {
    type: String,
    default: 'title',
  },
})
</script>
