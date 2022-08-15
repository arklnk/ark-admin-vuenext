<template>
  <div class="w-full flex flex-row flex-wrap items-center text-sm">
    <span class="inline-block flex-1 text-left text-black dark:text-white">{{ title }}</span>
    <ElSwitch
      :disabled="disabled"
      :model-value="def"
      inline-prompt
      :active-text="t('layout.setting.on')"
      :inactive-text="t('layout.setting.off')"
      @change="handleChange"
      size="default"
    />
  </div>
</template>

<script setup lang="ts">
import { useTransl } from '/@/composables/core/useTransl'

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

const { t } = useTransl()

function handleChange(val: string | number | boolean) {
  emit('change', val as boolean)
}
</script>
