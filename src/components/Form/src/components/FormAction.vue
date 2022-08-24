<template>
  <ElCol v-bind="actionColProps" v-if="showActionButtonGroup">
    <ElFormItem>
      <div class="w-full" :style="actionColStyle">
        <slot name="resetBefore"></slot>
        <ElButton v-if="showResetButton" v-bind="resetButtonProps" @click="resetAction">
          {{ t('common.basic.reset') }}
        </ElButton>
        <slot name="submitBefore"></slot>
        <ElButton
          v-if="showSubmitButton"
          type="primary"
          v-bind="submitButtonProps"
          @click="submitAction"
        >
          {{ t('common.basic.submit') }}
        </ElButton>
      </div>
    </ElFormItem>
  </ElCol>
</template>

<script lang="ts">
import { pick } from 'lodash-es'
import { defineComponent } from 'vue'
import { useFormContext } from '../composables/useFormContext'
import { basicProps } from '../props'
import { useTransl } from '/@/composables/core/useTransl'

export default defineComponent({
  name: 'BasicFormAction',
  props: pick(basicProps, [
    'showActionButtonGroup',
    'actionColProps',
    'actionColStyle',
    'showResetButton',
    'showSubmitButton',
    'submitButtonProps',
    'resetButtonProps',
  ]),
  setup() {
    const { t } = useTransl()

    return {
      t,
      ...useFormContext(),
    }
  },
})
</script>
