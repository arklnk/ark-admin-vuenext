<template>
  <ElResult class="p-20" :title="getStatusMapItem.title" :sub-title="getStatusMapItem.subTitle">
    <template v-if="getStatusMapItem.icon" #icon>
      <ElImage class="w-60 h-60" :src="getStatusMapItem.icon" />
    </template>
    <template v-if="getStatusMapItem.btnText" #extra>
      <ElButton @click="getStatusMapItem.handler" type="primary">
        {{ getStatusMapItem.btnText }}
      </ElButton>
    </template>
  </ElResult>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { useTransl } from '/@/composables/core/useTransl'
import { useGo } from '/@/composables/web/useGo'
import { PageEnum } from '/@/enums/pageEnum'

import pageNotFoundSvg from '/@/assets/svg/page-not-found.svg'
import withoutPermissonSvg from '/@/assets/svg/without-permission.svg'
import serverErrorSvg from '/@/assets/svg/server-error.svg'
import noDataSvg from '/@/assets/svg/no-data.svg'
import netErrorSvg from '/@/assets/svg/net-error.svg'
import { useRedo } from '/@/composables/web/useRedo'

interface StatusMapItem {
  title?: string
  subTitle?: string
  btnText?: string
  icon?: string
  handler?: Fn
}

type StatusCode = 204 | 403 | 404 | 408 | 500

const props = defineProps({
  status: {
    type: Number as PropType<StatusCode>,
    default: 404,
  },
})

const { t } = useTransl()
const go = useGo()
const redo = useRedo()

const statusMapRef = ref(new Map<StatusCode, StatusMapItem>())

// 204 status
unref(statusMapRef).set(204, {
  title: t('common.exception.noDataTitle'),
  btnText: t('common.basic.redo'),
  icon: noDataSvg,
  handler: () => redo(),
})

// 403 status
unref(statusMapRef).set(403, {
  title: '403',
  subTitle: t('common.exception.subTitle403'),
  btnText: t('common.exception.backHome'),
  icon: withoutPermissonSvg,
  handler: () => go(PageEnum.Dashboard),
})

// 404 status
unref(statusMapRef).set(404, {
  title: '404',
  subTitle: t('common.exception.subTitle404'),
  btnText: t('common.exception.backHome'),
  icon: pageNotFoundSvg,
  handler: () => go(PageEnum.Dashboard),
})

unref(statusMapRef).set(408, {
  title: t('common.exception.networkErrorTitle'),
  subTitle: t('common.exception.networkErrorSubTitle'),
  btnText: t('common.basic.redo'),
  icon: netErrorSvg,
  handler: () => redo(),
})

// 500 status
unref(statusMapRef).set(500, {
  title: '500',
  subTitle: t('common.exception.subTitle500'),
  btnText: t('common.exception.backHome'),
  icon: serverErrorSvg,
  handler: () => go(PageEnum.Dashboard),
})

const getStatusMapItem = computed(() => {
  const item = unref(statusMapRef).get(props.status)
  return item || {}
})
</script>
