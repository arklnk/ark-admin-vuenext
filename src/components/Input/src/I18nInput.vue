<template>
  <ElInput type="text" :model-value="modelValue" @update:model-value="handleUpdate">
    <template #append>{{ translateText }}</template>
  </ElInput>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTransl } from '/@/composables/core/useTransl'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

function handleUpdate(v: string) {
  emit('update:modelValue', v)
}

const { t } = useTransl()

const translateText = computed(() => t(props.modelValue || ''))
</script>
