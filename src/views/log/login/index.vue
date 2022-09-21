<template>
  <PageWrapper>
    <BasicTable
      :api="getLoginLogPageRequest"
      @register="register"
      row-key="id"
      :columns="createColumns()"
    />
  </PageWrapper>
</template>

<script setup lang="ts">
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { getLoginLogPageRequest } from '/@/api/log/login'
import { createColumns } from './columns'

const [register] = useTable()
</script>
