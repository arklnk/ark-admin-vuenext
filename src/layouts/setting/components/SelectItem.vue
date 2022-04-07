<template>
  <div class="w-full flex flex-row flex-wrap items-center text-sm">
    <span class="inline-block flex-1">{{ title }}</span>
    <el-select :disabled="disabled" :model-value="cursor" class="max-w-2/5" @change="handleChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const emit = defineEmits<{ (e: 'change', value: any): void }>()

defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  cursor: {
    type: [String, Number] as PropType<string | number>,
    required: true
  },
  options: {
    type: Array as PropType<LabelValueOptions>,
    default: () => []
  }
})

function handleChange(val: any) {
  emit('change', val)
}
</script>
