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
import { computed, CSSProperties, unref } from 'vue'

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useContentViewHeight } from '../content/useContentViewHeight'

const route = useRoute()
const frameSrc = route.meta.iframeSrc || ''

const loadingRef = ref(true)
function hideLoading() {
  loadingRef.value = false
}

const frameRef = ref<HTMLIFrameElement>()
const { contentHeight } = useContentViewHeight()
const getStyle = computed((): CSSProperties => {
  return {
    height: `${unref(contentHeight)}px`,
  }
})
</script>
