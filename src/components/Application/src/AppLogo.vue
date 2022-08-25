<template>
  <div
    class="flex flex-row items-center box-border cursor-pointer"
    :class="getWrapClass"
    @click="go('/')"
  >
    <img :class="`${prefixCls}__logo`" src="../../../assets/images/logo.png" />
    <div v-show="showTitle" :class="`${prefixCls}__title`" class="truncate">
      {{ t('common.appName') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'
import { useTransl } from '/@/composables/core/useTransl'
import { useGo } from '/@/composables/web/useGo'

const { t } = useTransl()

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

const getWrapClass = computed(() => [prefixCls, props.theme])

const go = useGo()
</script>

<style lang="scss">
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-logo;

.#{$prefixCls} {
  transition: all var.$transition-duration ease;
  display: flex;
  align-items: center;
  cursor: pointer;

  @include when(light) {
    color: var(--el-color-primary) !important;
    border-bottom: 1px solid var(--el-fill-color);
  }

  @include when(dark) {
    color: var.$color-white !important;
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
