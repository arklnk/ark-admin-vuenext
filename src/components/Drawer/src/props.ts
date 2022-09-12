import { drawerProps } from 'element-plus'
import { omit } from 'lodash-es'
import { ButtonProps } from '/@/components/Button'

export const basicProps = {
  // el-drawer原有属性
  ...omit(drawerProps, ['modelValue', 'customClass', 'beforeClose']),

  // 扩展属性
  visible: { type: Boolean },
  helpMessage: { type: String },
  loading: { type: Boolean },
  loadingTip: { type: String },
  showConfirmBtn: { type: Boolean, default: true },
  showCancelBtn: { type: Boolean, default: true },
  confirmText: { type: String },
  cancelText: { type: String },
  confirmBtnProps: { type: Object as PropType<Writable<Partial<ButtonProps>>> },
  cancelBtnProps: { type: Object as PropType<Writable<Partial<ButtonProps>>> },
  closeFunc: { type: Function as PropType<() => Promise<boolean>> },
}
