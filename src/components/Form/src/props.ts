import type { FormRules } from 'element-plus'
import type { SizeType } from '/#/config'

export const basicProps = {
  model: {
    type: Object as PropType<Recordable>,
    default: {},
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
}
