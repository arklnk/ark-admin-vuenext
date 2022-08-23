<template>
  <PageWrapper>
    <BasicTable :columns="columns" :api="getLoginLogPageRequest" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'

import { PageWrapper } from '/@/components/Page'
import { BasicTable } from '/@/components/Table'
import { ref } from 'vue'
import { useGetLoginLogPageRequest } from '/@/api/log/login'

const [getLoginLogPageRequest, _] = useGetLoginLogPageRequest()

const columns = ref<BasicColumn[]>([
  {
    label: '操作账号',
    prop: 'account',
  },
  {
    align: 'center',
    label: 'IP',
    prop: 'ip',
  },
  {
    align: 'center',
    label: '请求状态',
    prop: 'status',
    formatter: (row: Recordable) => {
      return row.status === 0 ? '失败' : '成功'
    },
  },
  {
    align: 'center',
    label: '请求路径',
    prop: 'uri',
  },
  {
    align: 'center',
    label: '登录时间',
    prop: 'createTime',
  },
])
</script>
