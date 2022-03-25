<template>
  <IconHamburger
    class="text-base cursor-pointer mx-4"
    :class="[d.b(), d.is('collapsed', getCollapsed)]"
    @click="toggleCollapse"
  />
</template>

<script setup lang="ts">
import IconHamburger from '~icons/ic/sharp-format-indent-increase'
import { useDesign } from '/@/hooks/core/useDesign'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'

const d = useDesign('app-hamburger')
const { getCollapsed, toggleCollapse } = useMenuSetting()
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
