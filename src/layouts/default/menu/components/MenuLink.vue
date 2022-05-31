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
    required: true,
  },
  redirect: {
    type: String,
    default: '',
  },
})

const isExternal = computed(() => {
  return isUrl(props.redirect)
})

const type = computed(() => {
  return unref(isExternal) ? 'a' : 'router-link'
})

const linkProps = computed(() => {
  if (unref(isExternal)) {
    // 外链重定向
    return {
      href: props.redirect,
      target: '_blank',
      rel: 'noopener',
    }
  } else {
    return { to: props.to }
  }
})
</script>
