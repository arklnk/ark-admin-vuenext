<template>
  <div class="flex flex-row items-center cursor-pointer" :class="[d.b(), theme]">
    <img class="w-8 h-8" src="../../../assets/images/logo.png" />
    <span class="ml-2">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useDesign } from '/@/hooks/core/useDesign'
const title = import.meta.env.VITE_APP_TITLE

defineProps({
  showTitle: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String as PropType<'light' | 'dark'>,
    validator: (v: string) => ['light', 'dark'].includes(v),
    required: true
  },
})

const d = useDesign('app-logo')
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

@include b(app-logo) {
  transition: all var.$transitionDuration;
  padding-left: 7px;

  .light {
    color: var.$color-black;
  }

  .dark {
    color: var.$color-white;
  }

  img {
    height: 32px;
    width: 32px;
  }
}
</style>
