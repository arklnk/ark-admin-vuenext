<template>
  <main class="relative w-full" :class="[prefixCls, getFixed ? 'is-fixed' : '']">
    <RouterView v-if="reloadFlag" v-slot="{ Component, route }">
      <Transition :name="getRouterTransition" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
    <AppFooter v-if="getShowFooter" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AppFooter from '../footer/index.vue'
import { useDesign } from '/@/hooks/core/useDesign'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting'

const reloadFlag = ref(true)

const { prefixCls } = useDesign('app-main')
const { getFixed } = useHeaderSetting()
const { getShowFooter } = useRootSetting()
const { getRouterTransition } = useTransitionSetting()
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

$prefixCls: #{var.$namespace}-app-main;

.#{$prefixCls} {
  @include when(is-fixed) {
    padding-top: var.$header-height;
  }
}
</style>
