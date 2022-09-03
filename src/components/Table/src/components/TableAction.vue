<template>
  <div class="flex items-center justify-center">
    <template v-for="(action, index) in getActions" :key="action.key || action.label">
      <ElButton v-if="!action.isPopconfirm" v-bind="action">{{ action.label }}</ElButton>
      <PopConfirmButton v-else v-bind="action">{{ action.label }}</PopConfirmButton>
      <ElDivider v-if="action.divider && index < getActions.length - 1" direction="vertical" />
    </template>

    <ElDropdown
      v-if="getDropdownActions && getDropdownActions.length > 0"
      trigger="hover"
      @command="handleDropdownCommand"
    >
      <ElButton link type="primary" :class="{ 'ml-3': getActions.length > 0 }">
        <slot name="more"></slot>
        <span v-if="!$slots.more" class="i-uiw:more"></span>
      </ElButton>

      <template #dropdown>
        <ElDropdownMenu>
          <template v-for="action in getDropdownActions" :key="action.command">
            <ElDropdownItem
              :command="action.command"
              :disabled="action.disabled"
              :divided="action.divider"
              :icon="action.icon"
            >
              {{ action.label }}
            </ElDropdownItem>
          </template>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<script setup lang="ts">
import type { TableActionItem } from '../types/action'

import { computed, unref } from 'vue'
import { usePermission } from '/@/composables/core/usePermission'
import { isBoolean, isFunction, isNil, omit } from 'lodash-es'
import { PopConfirmButton } from '/@/components/Button'
import { useMessage } from '/@/composables/web/useMessage'
import { useTransl } from '/@/composables/core/useTransl'
import { noop } from '/@/utils'

const props = defineProps({
  actions: {
    type: Array as PropType<TableActionItem[]>,
    default: null,
  },
  dropdownActions: {
    type: Array as PropType<TableActionItem[]>,
    default: null,
  },
})

const { hasPermission } = usePermission()
const { createMessageBox } = useMessage()
const { t } = useTransl()

function isHidden(item: TableActionItem) {
  if (isBoolean(item.hidden)) {
    return item.hidden
  }

  if (isFunction(item.hidden)) {
    return item.hidden(item)
  }

  return false
}

const getActions = computed(
  (): (TableActionItem & {
    popconfirmProps: TableActionItem['popconfirm']
    isPopconfirm: boolean
  })[] => {
    return (props.actions || [])
      .filter((act) => {
        // 未定义则不做判断
        if (isNil(act.permission)) return true

        return hasPermission(act.permission) && !isHidden(act)
      })
      .map((act) => {
        const { popconfirm = false } = act

        // true or order value will use popconfirm button
        let isPopconfirm = (isBoolean(popconfirm) && popconfirm) || !!popconfirm

        const popconfirmProps = {
          confirmButtonText: t('common.basic.confirm'),
          cancelButtonText: t('common.basic.cancel'),
          title: t('component.table.confirmMsg'),
          ...(isBoolean(popconfirm) ? {} : popconfirm),
        }

        return {
          link: true,
          type: 'primary',
          ...omit(act, 'popconfirm'),
          popconfirmProps,
          isPopconfirm,
        }
      })
  }
)

const getDropdownActions = computed(() => {
  return (props.dropdownActions || [])
    .filter((act) => {
      // 未定义则不做判断
      if (isNil(act.permission)) return true

      return hasPermission(act.permission) && !isHidden(act)
    })
    .map((act) => {
      const { popconfirm = false } = act

      // true or order value will use popconfirm button
      let isPopconfirm = (isBoolean(popconfirm) && popconfirm) || !!popconfirm

      const popconfirmProps = {
        confirmButtonText: t('common.basic.confirm'),
        cancelButtonText: t('common.basic.cancel'),
        title: t('component.table.confirmMsg'),
        ...(isBoolean(popconfirm) ? {} : popconfirm),
      }

      return {
        command: act.key || act.label,
        ...omit(act, 'popconfirm'),
        popconfirmProps,
        isPopconfirm,
      }
    })
})

function handleDropdownCommand(command: string) {
  const action = unref(getDropdownActions).find((act) => command === (act.key || act.label))
  if (!action) return

  // popconfirm check
  if (action.isPopconfirm) {
    createMessageBox
      .confirm(action.popconfirmProps?.title, {
        ...action.popconfirmProps,
        title: t('common.basic.warning'),
        type: 'warning',
      })
      .then(() => action.onClick?.())
      .catch(noop)
  } else {
    action.onClick?.()
  }
}
</script>
