<template>
  <div :class="d.b()" v-loading="loadingRef" :style="getStyle">
    <iframe
      :src="frameSrc"
      ref="frameRef"
      class="w-full h-full overflow-hidden border-0 box-border relative"
      @load="hideLoading"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, unref } from 'vue'

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutHeight } from '../content/useAppMainHeight'
import { useDesign } from '/@/hooks/core/useDesign'
import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn'

const route = useRoute()
const frameSrc = route.meta.iframeSrc || ''

const d = useDesign('app-iframe')
const loadingRef = ref(true)
function hideLoading() {
  loadingRef.value = false
}

const frameRef = ref<HTMLIFrameElement>()
const heightRef = ref(window.innerHeight)
const { appHeaderHeightRef } = useLayoutHeight()
const getStyle = computed((): CSSProperties => {
  return {
    height: `${unref(heightRef)}px`
  }
})
function calcHeight() {
  const iframe = unref(frameRef)
  if (!iframe) {
    return
  }
  const top = appHeaderHeightRef.value
  heightRef.value = window.innerHeight - top
}
useWindowSizeFn<void>(calcHeight, 150, { immediate: true })
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
</style>
