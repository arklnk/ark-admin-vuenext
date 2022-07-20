import type { ButtonProps, FormRules, RowProps, ColProps } from 'element-plus'
import type { CSSProperties } from 'vue'
import type { FormSchema } from './typing'
import type { SizeType } from '/#/config'

export const basicProps = {
  model: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  rules: {
    type: Object as PropType<FormRules>,
    default: null,
  },
  inline: {
    type: Boolean,
  },
  labelPosition: {
    type: String as PropType<'right' | 'left' | 'top'>,
    default: 'right',
  },
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
  },
  labelSuffix: {
    type: String,
  },
  hideRequiredAsterisk: {
    type: Boolean,
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
  inlineMessage: {
    type: Boolean,
  },
  statusIcon: {
    type: Boolean,
  },
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<SizeType>,
  },
  disabled: {
    type: Boolean,
  },
  scrollToError: {
    type: Boolean,
  },

  //------------ extend props
  // 紧凑
  compact: {
    type: Boolean,
  },
  // 表单项配置
  schemas: {
    type: Array as PropType<FormSchema[]>,
    default: () => [],
  },
  // 是否显示操作按钮栏
  showActionButtonGroup: {
    type: Boolean,
    default: true,
  },
  // 操作按钮栏el-col props
  actionColProps: {
    type: Object as PropType<Partial<Writable<ColProps>>>,
  },
  // 是否显示重置按钮
  showResetButton: {
    type: Boolean,
    default: true,
  },
  // 是否显示提交按钮
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  // 重置按钮props
  resetButtonProps: {
    type: Object as PropType<Partial<Writable<ButtonProps>>>,
  },
  // 提交按钮props
  submitButtonProps: {
    type: Object as PropType<Partial<Writable<ButtonProps>>>,
  },
  // el-row props
  rowProps: {
    type: Object as PropType<Partial<Writable<RowProps>>>,
  },
  rowStyle: {
    type: Object as PropType<CSSProperties>
  },
  // 重置、提交按钮函数
  resetFunc: Function as PropType<() => Promise<void>>,
  submitFunc: Function as PropType<() => Promise<void>>,
}
