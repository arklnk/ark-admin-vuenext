<template>
  <header
    ref="appHeaderRef"
    :class="d.b()"
    class="w-full border-gray-100 border-b flex flex-row px-2"
  >header</header>
</template>

<script setup lang="ts">
import { onMounted, Ref } from 'vue'

import { ref } from 'vue'
import { useLayoutHeight } from '../content/useAppMainHeight'
import { useDesign } from '/@/hooks/core/useDesign'
import { numberUnit } from '/@/utils'

const d = useDesign('app-header')
const { setAppHeaderHeight } = useLayoutHeight()

const appHeaderRef: Ref<HTMLElement | null> = ref(null)
onMounted(() => {
  const appHeaderStyle = getComputedStyle(appHeaderRef.value!)
  const appHeaderHeight = numberUnit(appHeaderStyle.borderBottomWidth) + numberUnit(appHeaderStyle.height)
  setAppHeaderHeight(appHeaderHeight)
})
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

@include b(app-header) {
  height: var.$navBarHeight;
  line-height: var.$navBarHeight;
}
</style>
