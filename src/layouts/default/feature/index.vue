<template>
  <ElBacktop v-if="getUseOpenBackTop" :target="getTarget" />
  <ProjectConfig v-if="getShowFixedSettingDrawer" :class="`${prefixCls}__setting-drawer`" />
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import ProjectConfig from '../setting/index.vue'
import { useDesign } from '/@/composables/core/useDesign'
import { useRootSetting } from '/@/composables/setting/useRootSetting'
import { useFullContent } from '/@/composables/web/useFullContent'

const { prefixCls } = useDesign('app-feature')
const { getFullContent } = useFullContent()
const { getShowSettingButton, getUseOpenBackTop } = useRootSetting()

const { prefixCls: layoutDefaultMainCls } = useDesign('layout-default-main')
const getTarget = computed(() => `.${layoutDefaultMainCls}`)

const getShowFixedSettingDrawer = computed(() => {
  if (!unref(getShowSettingButton)) {
    return false
  }

  return unref(getFullContent)
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-feature;

.#{$prefixCls} {
  &__setting-drawer {
    position: absolute;
    cursor: pointer;
    z-index: 99;
    right: 0;
    top: 120px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: var.$color-white;
    background-color: var(--el-color-primary);
    border-radius: 6px 0 0 6px;
    pointer-events: auto;
  }
}
</style>
