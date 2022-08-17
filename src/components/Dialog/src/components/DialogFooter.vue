<template>
  <slot name="prepend"></slot>
  <ElButton @click="handleCancel" v-bind="cancelBtnProps" v-if="showCancelBtn">
    {{ cancelText || t('common.basic.cancel') }}
  </ElButton>
  <slot name="center"></slot>
  <ElButton type="primary" v-bind="confirmBtnProps" @click="handleConfirm" v-if="showConfirmBtn">
    {{ confirmText || t('common.basic.confirm') }}
  </ElButton>
  <slot name="append"></slot>
</template>

<script setup lang="ts">
import type { ButtonProps } from 'element-plus'
import { useTransl } from '/@/composables/core/useTransl'

defineProps({
  confirmText: {
    type: String,
  },
  cancelText: {
    type: String,
  },
  confirmBtnProps: {
    type: Object as PropType<Writable<Partial<ButtonProps>>>,
  },
  cancelBtnProps: {
    type: Object as PropType<Writable<Partial<ButtonProps>>>,
  },
  showConfirmBtn: {
    type: Boolean,
  },
  showCancelBtn: {
    type: Boolean,
  },
})

const emit = defineEmits(['cancel', 'confirm'])

const { t } = useTransl()

function handleCancel() {
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>
