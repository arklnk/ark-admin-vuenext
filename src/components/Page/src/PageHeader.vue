<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-heading`">
      <span :class="`${prefixCls}-heading__title`">{{ title }}</span>
    </div>
    <div v-if="$slots.default && $slots.default?.length > 0" :class="`${prefixCls}-content`">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDesign } from '/@/composables/core/useDesign'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const { prefixCls } = useDesign('page-header')
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-page-header;

.#{$prefixCls} {
  position: relative;
  box-sizing: border-box;
  padding: 16px 24px;
  color: #000000d9;
  font-size: 14px;
  line-height: 1.75;
  list-style: none;
  background-color: var(--el-bg-color-overlay);

  &-heading {
    display: flex;
    align-items: center;
    margin: 4px 0;
    overflow: hidden;

    &__title {
      font-size: 20px;
      font-weight: 600;
      line-height: 32px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 12px;
    }
  }

  &-content {
    padding-top: 12px;
  }
}
</style>
