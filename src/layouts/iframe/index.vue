<template>
  <PageWrapper v-loading="loadingRef" fixed-height content-full-height :content-background="false" dense>
    <iframe
      :src="frameSrc"
      ref="frameRef"
      class="w-full h-full overflow-hidden border-0 box-border relative"
      @load="hideLoading"
    ></iframe>
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
