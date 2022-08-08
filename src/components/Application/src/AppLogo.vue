<template>
  <div
    class="flex flex-row items-center box-border cursor-pointer"
    :class="getWrapClass"
    @click="go('/')"
  >
    <img :class="`${prefixCls}__logo`" src="../../../assets/images/logo.png" />
    <div v-show="showTitle" :class="`${prefixCls}__title`" class="truncate">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'
import { useGo } from '/@/composables/web/useGo'
const attrs = useAttrs()
const title = import.meta.env.VITE_APP_TITLE

const props = defineProps({
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

const getWrapClass = computed(() => [prefixCls, props.theme, attrs.class])

const go = useGo()
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-logo;

.#{$prefixCls} {
  transition: all var.$transition-duration ease;
  display: flex;
  align-items: center;
  cursor: pointer;

  @include when(light) {
    color: var(--el-color-primary);
    border-bottom: 1px solid var.$border-color-base;
  }

  @include when(dark) {
    color: var.$color-white;
  }

  &__title {
    transition: all 0.5s;
    letter-spacing: 2px;
    font-weight: 600;
    font-size: 18px;
    margin-left: 8px;
  }

  &__logo {
    height: 32px;
    width: 32px;
  }
}
</style>
