import { ButtonProps } from 'element-plus'

export const basicProps = {
  // el-dialog props
  draggable: { type: Boolean, default: true },
  top: { type: String, default: '15vh' },
  width: { type: [String, Number] as PropType<string | number>, default: '50%' },
  modal: { type: Boolean, default: true },
  appendToBody: { type: Boolean },
  lockScroll: { type: Boolean, default: true },
  openDelay: { type: Number, default: 0 },
  closeDelay: { type: Number, default: 0 },
  closeOnClickModal: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  destroyOnClose: { type: Boolean },

  // extra props
  visible: { type: Boolean },
  defaultFullscreen: { type: Boolean },
  minHeight: { type: [String, Number] as PropType<string | number> },
  // 在全屏下该值无效，会直接占满容器剩余高度
  height: { type: [String, Number] as PropType<string | number> },
  loading: { type: Boolean },
  loadingTip: { type: String },
  canFullscreen: { type: Boolean, default: true },
  showConfirmBtn: { type: Boolean, default: true },
  showCancelBtn: { type: Boolean, default: true },
  confirmText: { type: String },
  cancelText: { type: String },
  confirmBtnProps: { type: Object as PropType<Writable<Partial<ButtonProps>>> },
  cancelBtnProps: { type: Object as PropType<Writable<Partial<ButtonProps>>> },
  title: { type: String },
  helpMessage: { type: String },
  closeFunc: { type: Function as PropType<() => Promise<boolean>> },
}
