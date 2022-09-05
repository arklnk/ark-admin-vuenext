<template>
  <PageWrapper content-full-height>
    <ElTabs tab-position="left" class="p-4">
      <ElTabPane label="基本资料">
        <BasicProfile />
      </ElTabPane>

      <ElTabPane label="安全设置">
        <SecureSetting />
      </ElTabPane>
    </ElTabs>
  </PageWrapper>
</template>

<script setup lang="ts">
import { PageWrapper } from '/@/components/Page'
import BasicProfile from './BasicProfile.vue'
import SecureSetting from './SecureSetting.vue'
</script>
