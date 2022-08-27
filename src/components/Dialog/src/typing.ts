import type { ExtractPropTypes } from 'vue'
import { basicProps } from './props'

export type BasicDialogProps = Partial<ExtractPropTypes<typeof basicProps>>

export interface BasicDialogActionType {
  setProps: (props: Partial<BasicDialogProps>) => void
}

export interface ExtraBasicDialogActionType extends BasicDialogActionType {
  openDialog: <T = any>(data?: T) => void
  closeDialog: () => void
  setLoading: (loading?: boolean) => void
  setConfirmLoading: (loading?: boolean) => void
}

export type RegisterFn = (action: BasicDialogActionType, uid: number) => void

export type UseDialogReturnType = [RegisterFn, ExtraBasicDialogActionType]

export type UseDialogInnerReturnType = [RegisterFn, Omit<ExtraBasicDialogActionType, 'openDialog'>]
