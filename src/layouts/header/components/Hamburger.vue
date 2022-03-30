<template>
  <IconHamburger :class="[d.b(), d.is('collapsed', collapsed)]" />
</template>

<script setup lang="ts">
import IconHamburger from '~icons/icon-park-outline/indent-right'
import { useDesign } from '/@/hooks/core/useDesign'

defineProps({
  collapsed: {
    type: Boolean,
    required: true
  }
})

const d = useDesign('app-hamburger')
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

@include b(app-hamburger) {
  transition: transform var.$transitionDuration;
  @include when(collapsed) {
    transform: rotate(180deg);
  }
}
</style>
