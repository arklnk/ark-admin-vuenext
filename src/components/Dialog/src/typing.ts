import { ButtonProps } from 'element-plus'

export interface BasicDialogProps {
  draggable?: boolean
  fullscreen?: boolean
  top?: string
  width?: string | number
  modal?: boolean
  appendToBody?: boolean
  lockScroll?: boolean
  customClass?: string
  openDelay?: number
  closeDelay?: number
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  destroyOnClose?: boolean

  // extra props
  visible?: boolean
  defaultFullscreen?: boolean
  loading?: boolean
  loadingTip?: string
  canFullscreen?: boolean
  showConfirmBtn?: boolean
  showCancelBtn?: boolean
  confirmText?: string
  cancelText?: string
  confirmBtnProps?: Writeable<Partial<ButtonProps>>
  cancelBtnProps?: Writeable<Partial<ButtonProps>>
  title?: string
  helpMessage?: string
  closeFunc?: () => Promise<boolean>
}

export interface BasicDialogActionType {
  setProps: (props: Partial<BasicDialogProps>) => void
}

export interface UseDialogDialogActionType extends BasicDialogActionType {
  openDialog: <T = any>(data?: T) => void
  closeDialog: () => void
  setLoading: (loading?: boolean) => void
}

export type RegisterFn = (action: BasicDialogActionType, uid: number) => void
