<template>
  <component :is="type" v-bind="linkProps">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'

import { isUrl } from '/@/utils/is'

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const isExternal = computed(() => {
  return isUrl(props.to)
})

const type = computed(() => {
  return unref(isExternal) ? 'a' : 'router-link'
})

const linkProps = computed(() => {
  return unref(isExternal) ? {
    href: props.to,
    target: '_blank',
    rel: 'noopener'
  } : { to: props.to }
})
</script>
