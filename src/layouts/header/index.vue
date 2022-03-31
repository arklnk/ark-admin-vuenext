<template>
  <header
    ref="appHeaderRef"
    :class="[d.b(), d.is('fixed', getFixed), d.is('collapsed', getCollapsed), isLightBgColor ? 'text-gray-700' : 'text-white']"
    :style="{ backgroundColor: getBgColor }"
    class="border-gray-100 border-b flex flex-row justify-between box-border relative"
  >
    <nav class="item items-center text-lg !px-4" @click="toggleCollapse">
      <Hamburger :collapsed="getCollapsed" />
    </nav>
    <nav :class="d.e('right-menu')" class="flex h-full text-lg">
      <FullScreen class="item" />
      <UserDropdown class="item" />
      <ProjectConfig class="item" />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { ref } from 'vue'
import { FullScreen, Hamburger, UserDropdown } from './components'
import ProjectConfig from '../setting/index.vue'

import { useLayoutHeight } from '../content/useAppMainHeight'
import { useDesign } from '/@/hooks/core/useDesign'
import { numberUnit } from '/@/utils'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { isLight } from '/@/utils/color'

const d = useDesign('app-header')
const { setAppHeaderHeight } = useLayoutHeight()

const appHeaderRef = ref<HTMLElement>()
onMounted(() => {
  const appHeaderStyle = getComputedStyle(appHeaderRef.value!)
  setAppHeaderHeight(numberUnit(appHeaderStyle.height))
})

const { getFixed, getBgColor } = useHeaderSetting()
const { getCollapsed, toggleCollapse } = useMenuSetting()

const isLightBgColor = computed(() => isLight(getBgColor.value))
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

@include b(app-header) {
  height: var.$navBarHeight;
  line-height: var.$navBarHeight;
  transition: width var.$transitionDuration;

  @include when(fixed) {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - var.$sideBarWidth);

    @include when(collapsed) {
      width: calc(100% - var.$sideBarCollapsedWidth);
    }
  }

  .item {
    height: 100%;
    display: flex;
    padding: 0 8px;
    cursor: pointer;
    align-items: center;
    position: relative;

    &::before {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-color: #ccc;
      background-color: #ccc;
      opacity: 0;
      content: " ";
      pointer-events: none;
    }

    &:hover::before {
      opacity: 0.1;
    }
  }
}
</style>
