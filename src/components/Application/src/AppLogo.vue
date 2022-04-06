<template>
  <div
    class="flex flex-row items-center text-sm font-semibold box-border cursor-pointer"
    :class="[prefixCls, theme, $attrs.class]"
  >
    <img class="w-8 h-8" src="../../../assets/images/logo.png" />
    <span v-show="showTitle" class="ml-2">{{ title }}</span>
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
    default: 'light'
  },
})

const { prefixCls } = useDesign('app-logo')
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-logo;

.#{$prefixCls} {
  transition: all var.$transitionDuration;
  letter-spacing: 2px;
  padding-left: calc(#{var.$sideBarCollapsedWidth} / 2 - 16px);

  @include when(light) {
    color: var.$color-black;
    border-bottom: 1px solid var.$border-color-base;
  }

  @include when(dark) {
    color: var.$color-white;
  }

  img {
    height: 32px;
    width: 32px;
  }
}
</style>
