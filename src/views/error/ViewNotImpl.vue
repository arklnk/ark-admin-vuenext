<template>
  <PageWrapper fixed-height content-full-height include-footer>
    <ElResult
      class="h-full"
      icon="error"
      :title="t('views.viewnotimpl.title')"
      :sub-title="t('views.viewnotimpl.subTitle')"
    />
  </PageWrapper>
</template>

<script setup lang="ts">
import { PageWrapper } from '/@/components/Page'
import { useTransl } from '/@/composables/core/useTransl'

const { t } = useTransl()
</script>
