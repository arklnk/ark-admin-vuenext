<template>
  <div
    class="flex flex-row items-center box-border cursor-pointer"
    :class="[prefixCls, theme, $attrs.class]"
    @click="go('/')"
  >
    <img class="w-8 h-8" src="../../../assets/images/logo.png" />
    <span v-show="showTitle" class="ml-2">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'
import { useGo } from '/@/composables/web/useGo'
const title = import.meta.env.VITE_APP_TITLE

defineProps({
  showTitle: {
    type: Boolean,
    default: true,
  },
  theme: {
    type: String as PropType<'light' | 'dark'>,
    validator: (v: string) => ['light', 'dark'].includes(v),
    default: 'light',
  },
})

const { prefixCls } = useDesign('app-logo')

const go = useGo()
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-logo;

.#{$prefixCls} {
  transition: all var.$transition-duration;
  letter-spacing: 2px;
  font-weight: 600;
  font-size: 18px;

  @include when(light) {
    color: var(--el-color-primary);
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
