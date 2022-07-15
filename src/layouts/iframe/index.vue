<template>
  <PageWrapper
    v-loading="loadingRef"
    fixed-height
    content-full-height
    :content-background="false"
    dense
  >
    <div class="w-full h-full overflow-hidden border-0 box-border relative">
      <!-- iframe默认有一个2px宽度的border -->
      <iframe
        :src="frameSrc"
        ref="frameRef"
        @load="hideLoading"
        frameborder="0"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { PageWrapper } from '/@/components/Page'

const route = useRoute()
const frameSrc = route.meta.iframeSrc || ''

const loadingRef = ref(true)
function hideLoading() {
  loadingRef.value = false
}
</script>
