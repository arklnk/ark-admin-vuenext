<template>
  <header
    ref="appHeaderRef"
    :class="[d.b(), d.is('fixed', getFixed)]"
    class="border-gray-100 border-b flex flex-row px-2 items-center justify-between bg-white box-border"
  >
    <nav :class="d.e('breadcrumb')">breadcrumb</nav>
    <nav :class="d.e('right-menu')" class="text-gray-700">
      <AppScreenfull />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onMounted, Ref } from 'vue'

import { ref } from 'vue'
import { AppScreenfull } from '/@/components/Application'

import { useLayoutHeight } from '../content/useAppMainHeight'
import { useDesign } from '/@/hooks/core/useDesign'
import { numberUnit } from '/@/utils'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'

const d = useDesign('app-header')
const { setAppHeaderHeight } = useLayoutHeight()

const appHeaderRef: Ref<HTMLElement | null> = ref(null)
onMounted(() => {
  const appHeaderStyle = getComputedStyle(appHeaderRef.value!)
  setAppHeaderHeight(numberUnit(appHeaderStyle.height))
})

const { getFixed } = useHeaderSetting()
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

@include b(app-header) {
  height: var.$navBarHeight;
  line-height: var.$navBarHeight;
  width: calc(100% - var.$sideBarWidth);

  @include when(fixed) {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    transition: width 0.8s;
  }

  @include e(right-menu) {
    font-size: 20px;

    svg {
      margin: 0 5px;
    }
  }
}
</style>
