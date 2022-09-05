<template>
  <PageWrapper fixed-height content-full-height include-footer>
    <ElResult
      class="h-full"
      icon="error"
      :title="t('common.exception.dynamicImport')"
      :sub-title="t('common.exception.dynamicImportDesc')"
    />
  </PageWrapper>
</template>

<script setup lang="ts">
import { PageWrapper } from '/@/components/Page'
import { useTransl } from '/@/composables/core/useTransl'

const { t } = useTransl()
</script>
