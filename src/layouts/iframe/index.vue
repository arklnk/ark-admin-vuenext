<template>
  <div v-loading="loadingRef" :style="getStyle">
    <iframe
      :src="frameSrc"
      ref="frameRef"
      class="w-full h-full overflow-hidden border-0 box-border relative"
      @load="hideLoading"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, unref, watch } from 'vue'

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutHeight } from '../content/useContentViewHeight'
import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'

const route = useRoute()
const frameSrc = route.meta.iframeSrc || ''

const loadingRef = ref(true)
function hideLoading() {
  loadingRef.value = false
  calcHeight()
}

const frameRef = ref<HTMLIFrameElement>()
const heightRef = ref(window.innerHeight)
const topRef = ref(50)
const { appHeaderHeightRef } = useLayoutHeight()
const { getFullContent } = useRootSetting()
const getStyle = computed((): CSSProperties => {
  return {
    height: `${unref(heightRef)}px`,
  }
})

function calcHeight() {
  const iframe = unref(frameRef)
  if (!iframe) {
    return
  }

  const top = getFullContent.value ? 0 : appHeaderHeightRef.value
  topRef.value = top
  heightRef.value = window.innerHeight - top
  // const clientHeight = document.documentElement.clientHeight - top
  // iframe.style.height = `${clientHeight}px`
}

useWindowSizeFn<void>(calcHeight, 150, { immediate: true })

watch(getFullContent, calcHeight)
</script>
