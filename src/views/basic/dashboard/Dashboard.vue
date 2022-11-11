<template>
  <PageWrapper :content-background="false">
    <ElCard class="px-4">
      <div class="font-semibold my-4 text-xl">您好, {{ getUsername }}, 欢迎使用方舟管理后台!</div>
      <div class="text-gray-500 my-4 text-sm flex items-center">
        使用文档: <ElLink class="ml-4" type="primary" :href="DOC_SITE">{{ DOC_SITE }}</ElLink>
      </div>
      <div class="text-gray-500 my-4 text-sm flex items-center">
        前端仓库:
        <ElLink class="ml-4" type="primary" :href="VUE_REPO_GITHUB_URL">{{
          VUE_REPO_GITHUB_URL
        }}</ElLink>
      </div>
      <div class="text-gray-500 my-4 text-sm flex items-center">
        Go-Zero后端仓库:
        <ElLink class="ml-4" type="primary" :href="ZERO_REPO_GITHUB_URL">{{
          ZERO_REPO_GITHUB_URL
        }}</ElLink>
      </div>
      <div class="text-gray-500 my-4 text-sm flex items-center">
        Nestjs后端仓库:
        <ElLink class="ml-4" type="primary" :href="ZERO_REPO_GITHUB_URL">{{
          NEST_REPO_GITHUB_URL
        }}</ElLink>
      </div>
    </ElCard>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PageWrapper } from '/@/components/Page'
import { DOC_SITE, VUE_REPO_GITHUB_URL, ZERO_REPO_GITHUB_URL, NEST_REPO_GITHUB_URL } from '/@/settings/siteSetting'
import { useUserStore } from '/@/stores/modules/user'

const userStore = useUserStore()

const getUsername = computed(() => userStore.getUserInfo?.username)
</script>
