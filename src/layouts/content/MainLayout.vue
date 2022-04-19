<template>
  <main :class="[prefixCls, getFixed ? 'is-header-fixed' : '', contentModeClass]">
    <RouterView v-slot="{ Component, route }">
      <Transition :name="getRouterTransition" mode="out-in">
        <div :key="route.fullPath"><component :is="Component" /></div>
      </Transition>
    </RouterView>
    <AppFooter v-if="getShowFooter" />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppFooter from '../footer/index.vue'
import { useDesign } from '/@/hooks/core/useDesign'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting'

const { prefixCls } = useDesign('app-main')
const { getFixed } = useHeaderSetting()
const { getShowFooter, getContentMode } = useRootSetting()
const { getRouterTransition } = useTransitionSetting()

const contentModeClass = computed(() => `content-${getContentMode.value}`)
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

$prefixCls: #{var.$namespace}-app-main;

.#{$prefixCls} {
  position: relative;

  @include when(is-header-fixed) {
    padding-top: var.$header-height;
  }

  @include when(content-full) {
    width: 100%;
  }

  @include when(content-fixed) {
    width: var.$app-main-fixed-width;
    margin: 0 auto;
  }
}
</style>
