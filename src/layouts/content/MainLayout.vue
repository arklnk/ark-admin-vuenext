<template>
  <main class="relative w-full" :class="[prefixCls, getFixed ? 'is-fixed' : '']">
    <RouterView v-if="reloadFlag" v-slot="{ Component, route }">
      <Transition name="fade-bottom" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDesign } from '/@/hooks/core/useDesign'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'

const reloadFlag = ref(true)

const { prefixCls } = useDesign('app-main')
const { getFixed } = useHeaderSetting()
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

$prefixCls: #{var.$namespace}-app-main;

.#{$prefixCls} {
  @include when(is-fixed) {
    padding-top: var.$navBarHeight;
  }
}
</style>
