import type { PropType } from 'vue'
import { ButtonProps } from 'element-plus'

export const basicProps = {
  // el-dialog props
  draggable: { type: Boolean },
  fullscreen: { type: Boolean },
  top: { type: String, default: '15vh' },
  width: { type: [String, Number] as PropType<string | number>, default: '50%' },
  modal: { type: Boolean, default: true },
  appendToBody: { type: Boolean },
  lockScroll: { type: Boolean, default: true },
  customClass: { type: String },
  openDelay: { type: Number, default: 0 },
  closeDelay: { type: Number, default: 0 },
  closeOnClickModal: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  beforeClose: { type: Function },
  destroyOnClose: { type: Boolean },

  // extra props
  visible: { type: Boolean },
  loading: { type: Boolean },
  canFullscreen: { type: Boolean, default: true },
  canClose: { type: Boolean, default: true },
  showConfirmBtn: { type: Boolean, default: true },
  showCancelBtn: { type: Boolean, default: true },
  confirmBtnProps: { type: Object as PropType<ButtonProps> },
  cancelBtnProps: { type: Object as PropType<ButtonProps> },
  title: { type: String },
  helpMessage: { type: String },
}
