<template>
  <footer :class="prefixCls" class="w-full text-center text-sm">
    <div>Copyright © 2021 SF Admin</div>
  </footer>
</template>

<script setup lang="ts">
import { useDesign } from '/@/hooks/core/useDesign'

const { prefixCls } = useDesign('app-footer')
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-footer;

.#{$prefixCls} {
  color: #57606a;
  padding: 24px 50px;
  color: #57606a;
}
</style>
