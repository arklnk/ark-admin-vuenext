<template>
  <span class="inline-flex flex-row items-center select-none">
    <template v-if="title">{{ title }}</template>
    <slot v-else></slot>
    <ElTooltip v-if="helpMessage" :content="helpMessage" :placement="helpPlacement">
      <span class="ml-2 cursor-pointer text-sm text-info i-charm:circle-warning"></span>
    </ElTooltip>
  </span>
</template>

<script setup lang="ts">
import type { Placement } from 'element-plus'

defineProps({
  helpMessage: {
    type: String,
    default: '',
  },
  helpPlacement: {
    type: String as PropType<Placement>,
    default: 'right',
  },
  title: {
    type: String,
    default: '',
  },
})
</script>

<script lang="ts">
export default {
  name: 'BasicHeading',
}
</script>
