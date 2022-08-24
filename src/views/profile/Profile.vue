<template>
  <PageWrapper content-full-height fixed-height>
    <ElTabs tab-position="top" class="px-4 py-2">
      <ElTabPane label="基本信息">
        <BasicForm :show-reset-button="false" />
      </ElTabPane>
      <ElTabPane label="安全信息">
        <BasicForm :show-reset-button="false" />
      </ElTabPane>
    </ElTabs>
  </PageWrapper>
</template>

<script setup lang="ts">
import { BasicForm } from '/@/components/Form'
import { PageWrapper } from '/@/components/Page'
</script>
