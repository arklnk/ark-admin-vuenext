<template>
  <div class="flex flex-row items-center min-h-6">
    {{ title }}
    <ElTooltip v-if="helpMessage" :content="helpMessage" placement="right">
      <el-icon class="ml-2 hover:text-primary cursor-pointer text-base text-info">
        <Warning />
      </el-icon>
    </ElTooltip>
  </div>
</template>

<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'

defineProps({
  helpMessage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
})
</script>
