<template>
  <ElScrollbar height="100%" :wrap-class="d.b()">a</ElScrollbar>
</template>

<script setup lang="ts">
import { useDesign } from '/@/hooks/core/useDesign'

const d = useDesign('sidebar')
</script>

<style lang="scss">
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

@include b(sidebar) {
  width: $sideBarWidth;
}
</style>
