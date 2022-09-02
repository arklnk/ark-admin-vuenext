<template>
  <PageWrapper>
    <BasicTable :api="getLoginLogPageRequest" @register="register" />
  </PageWrapper>
</template>

<script setup lang="ts">
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { getLoginLogPageRequest } from '/@/api/log/login'

const [register] = useTable({
  columns: [
    {
      type: 'index',
    },
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
  ],
})
</script>
