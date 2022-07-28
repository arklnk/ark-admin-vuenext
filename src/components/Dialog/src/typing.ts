import type { ExtractPropTypes } from 'vue'
import { basicProps } from './props'

export type BasicDialogProps = ExtractPropTypes<typeof basicProps>

export interface BasicDialogActionType {
  setProps: (props: Partial<BasicDialogProps>) => void
}

export interface ExtraBasicDialogActionType extends BasicDialogActionType {
  openDialog: <T = any>(data?: T) => void
  closeDialog: () => void
  setLoading: (loading?: boolean) => void
}

export type RegisterFn = (action: BasicDialogActionType, uid: number) => void

export type UseDialogReturnType = [RegisterFn, ExtraBasicDialogActionType]
