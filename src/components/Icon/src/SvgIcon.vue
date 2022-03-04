<template>
  <svg
    :class="['sf-svgicon', $attrs.class, spin && 'svgicon--spin']"
    :style="style"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  icon: {
    type: String,
    required: true
  },
  spin: {
    type: Boolean,
    default: false
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.icon}`)
const style = computed((): CSSProperties => {
  const { size } = props
  let s = `${size}`
  s = `${s.replace('px', '')}px`
  return {
    width: s,
    height: s,
  }
})
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;

@include b(svgicon) {
  @include m(spin) {
    animation: loadingCircle 1s infinite linear;
  }
}
</style>
