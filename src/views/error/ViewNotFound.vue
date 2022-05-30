<template>
  <PageWrapper fixed-height include-footer title="测试">
    <ElResult class="h-full" icon="error" title="页面载入错误" sub-title="请检查对应动态载入页面路径下的文件" />
  </PageWrapper>
</template>

<script setup lang="ts">
import { PageWrapper } from '/@/components/Page'
</script>
