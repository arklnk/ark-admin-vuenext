<template>
  <svg :class="[d.b(), $attrs.class, d.is('spin', spin)]" :style="style" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'SvgIcon'
}
</script>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { computed } from 'vue'
import { useDesign } from '/@/hooks/core/useDesign'

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

const d = useDesign('svg-icon')
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

@include b(svg-icon) {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;

  @keyframes spin-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @include when(spin) {
    animation: spin-animation 1s infinite linear;
  }
}
</style>
