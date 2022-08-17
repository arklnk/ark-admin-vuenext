<template>
  <PageWrapper>
    <BasicTable :columns="columns" :api="processRequestData" row-key="id" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'

import { PageWrapper } from '/@/components/Page'
import { BasicTable } from '/@/components/Table'
import { ref } from 'vue'
import { useTransl } from '/@/composables/core/useTransl'
import { useGetRoleListRequest } from '/@/api/system/role.api'
import { listToTree } from '/@/utils/helper/tree'

const { t } = useTransl()

const [getRoleListRequest, _] = useGetRoleListRequest()

async function processRequestData() {
  const { list } = await getRoleListRequest()
  return listToTree(list)
}

const columns = ref<BasicColumn[]>([
  {
    label: t('views.system.role.name'),
    prop: 'name',
  },
  {
    label: t('views.system.role.uniqueKey'),
    prop: 'uniqueKey',
  },
])
</script>
