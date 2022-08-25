<template>
  <div :class="prefixCls" :style="getWrapStyle">
    <RouterView>
      <template #default="{ Component, route }">
        <transition
          :name="
            getTransitionName({
              def: getRouterTransition,
              enableTransition: getEnableTransition,
              route,
            })
          "
          mode="out-in"
          appear
        >
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </template>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { computed, unref } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'
import { useRootSetting } from '/@/composables/setting/useRootSetting'
import { useTransitionSetting } from '/@/composables/setting/useTransitionSetting'
import { getTransitionName } from './getTransitionName'
import { ContentEnum, APP_CONTENT_FIXED_WIDTH } from '/@/enums/appEnum'

const { prefixCls } = useDesign('app-content')
const { getContentMode } = useRootSetting()
const { getRouterTransition, getEnableTransition } = useTransitionSetting()

// fixed width style
const getWrapStyle = computed((): CSSProperties => {
  const style: Recordable = {}

  if (unref(getContentMode) === ContentEnum.FIXED) {
    style.width = `${APP_CONTENT_FIXED_WIDTH}px`
    style.margin = '0 auto'
  }

  return style
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-content;

.#{$prefixCls} {
  position: relative;
  min-height: 0;
}
</style>
