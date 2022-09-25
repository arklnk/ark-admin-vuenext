<template>
  <span><span class="i-icon-park-outline:indent-right" :class="getWrapClass"></span></span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'

const props = defineProps({
  collapsed: {
    type: Boolean,
    required: true,
  },
})

const { prefixCls } = useDesign('app-menu-trigger')

const getWrapClass = computed(() => {
  return [
    prefixCls,
    {
      'is-collapsed': props.collapsed,
    },
  ]
})
</script>

<style lang="scss">
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-menu-trigger;

.#{$prefixCls} {
  transition: transform var.$transition-duration;

  @include when(is-collapsed) {
    transform: rotate(180deg);
  }
}
</style>
