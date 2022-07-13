<template>
  <div class="h-32 p-10">
    <ElButton @click.right="handleClick">右键</ElButton>
    <ElButton @click="handleShowMessage">Bug ElMessage</ElButton>
  </div>
</template>

<script setup lang="ts">
import { createContextMenu } from '/@/components/ContextMenu/src/createContextMenu'
import IcBaselineWbSunny from '~icons/ic/baseline-wb-sunny'

import { ElMessage } from 'element-plus'

function handleShowMessage() {
  ElMessage({
    type: 'error',
    message: '弹出消息，但是会出现报错并且页面卡死',
  })
}

function handleClick(e: PointerEvent) {
  createContextMenu({
    event: e,
    items: [
      {
        label: 'dashboard1',
        icon: IcBaselineWbSunny,
        divider: true,
        handler: () => {
          console.log('dashboard')
        },
      },
      {
        label: 'dashboard2',
        icon: IcBaselineWbSunny,
        disabled: false,
        handler: () => {
          console.log('dashboard')
        },
        children: [
          {
            label: 'dashboard2',
            icon: 'netdisk',
            disabled: true,
            handler: () => {
              console.log('dashboard')
            },
          },
        ],
      },
    ],
  })
}
</script>
