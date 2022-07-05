<template>
  <div :class="[prefixCls, getIsContentFixed ? 'fixed' : '']">
    <RouterView v-slot="{ Component, route }">
      <transition
        :name="
          getTransitionName({
            def: getRouterTransition,
            enableTransition: getEnableTransition,
            route,
          })
        "
        mode="out-in"
      >
        <main :key="route.fullPath">
          <component :is="Component" />
        </main>
      </transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'
import { useRootSetting } from '/@/composables/setting/useRootSetting'
import { useTransitionSetting } from '/@/composables/setting/useTransitionSetting'
import { getTransitionName } from './getTransitionName'
import { ContentEnum } from '/@/enums/appEnum'

const { prefixCls } = useDesign('app-content')
const { getContentMode } = useRootSetting()
const { getRouterTransition, getEnableTransition } = useTransitionSetting()
const getIsContentFixed = computed(() => unref(getContentMode) === ContentEnum.FIXED)
</script>

<style lang="scss">
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

$prefixCls: #{var.$namespace}-app-content;

.#{$prefixCls} {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;

  @include when(fixed) {
    width: var.$app-content-fixed-width;
    margin: 0 auto;
  }
}
</style>
