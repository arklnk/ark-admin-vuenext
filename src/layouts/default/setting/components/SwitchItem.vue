<template>
  <div class="w-full flex flex-row flex-wrap items-center text-sm">
    <span class="inline-block flex-1 text-left text-black dark:text-white">{{ title }}</span>
    <ElSwitch
      :disabled="disabled"
      :value="def"
      inline-prompt
      active-text="开"
      inactive-text="关"
      @change="handleChange"
      size="default"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  def: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{ (e: 'change', value: boolean): void }>()

function handleChange(val: string | number | boolean) {
  emit('change', val as boolean)
}
</script>
