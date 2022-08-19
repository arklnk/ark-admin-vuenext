<template>
  <PageWrapper :content-background="false" content-full-height fixed-height>
    <div class="flex flex-row h-full relative">
      <div class="mr-2 h-full w-[300px] bg-comp">部门列表</div>
      <div class="flex-1 h-full bg-comp">用户列表</div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { PageWrapper } from '/@/components/Page'
</script>
