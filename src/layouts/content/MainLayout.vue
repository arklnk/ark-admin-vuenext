<template>
  <main :class="[prefixCls, isFixed ? 'is-header-fixed' : '', contentModeClass]">
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
        <div :key="route.fullPath">
          <component :is="Component" />
        </div>
      </transition>
    </RouterView>
    <AppFooter v-if="getShowFooter" />
    <ProjectConfig v-if="getFullContent && getShowSettingButton" :class="`${prefixCls}__setting`" />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppFooter from '../footer/index.vue'
import ProjectConfig from '../setting/index.vue'
import { useDesign } from '/@/hooks/core/useDesign'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting'
import { getTransitionName } from './getTransitionName'

const { prefixCls } = useDesign('app-main')
const { getFixed } = useHeaderSetting()
const { getShowFooter, getContentMode, getFullContent, getShowSettingButton } = useRootSetting()
const { getRouterTransition, getEnableTransition } = useTransitionSetting()

const isFixed = computed(() => (getFullContent.value ? false : getFixed.value))

const contentModeClass = computed(() => `content-${getContentMode.value}`)
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

$prefixCls: #{var.$namespace}-app-main;

.#{$prefixCls} {
  position: relative;

  &__setting {
    position: fixed;
    cursor: pointer;
    right: 0;
    top: 120px;
    z-index: 11;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: var.$color-white;
    background-color: var(--el-color-primary);
    border-radius: 6px 0 0 6px;
    pointer-events: auto;
  }

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
