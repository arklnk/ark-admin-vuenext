<template>
  <ElCol v-bind="actionColProps" v-if="showActionButtonGroup">
    <ElFormItem>
      <div class="w-full flex justify-end">
        <slot name="resetBefore"></slot>
        <ElButton v-if="showResetButton" v-bind="resetButtonProps" @click="resetAction">
          重置
        </ElButton>
        <slot name="submitBefore"></slot>
        <ElButton
          v-if="showSubmitButton"
          type="primary"
          v-bind="submitButtonProps"
          @click="submitAction"
        >
          {{ submitButtonText }}
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

export default defineComponent({
  name: 'BasicFormAction',
  props: pick(basicProps, [
    'showActionButtonGroup',
    'actionColProps',
    'showResetButton',
    'showSubmitButton',
    'submitButtonText',
    'submitButtonProps',
    'resetButtonProps',
  ]),
  setup() {
    return {
      ...useFormContext(),
    }
  },
})
</script>
