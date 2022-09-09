import type { ExtractPropTypes } from 'vue'
import { basicProps } from './props'

export type BasicDrawerProps = Partial<ExtractPropTypes<typeof basicProps>>

export interface BasicDrawerActionType {
  setProps: (props: Partial<BasicDrawerProps>) => void
}

export interface ExtraBasicDrawerActionType extends BasicDrawerActionType {
  openDrawer: <T = any>(data?: T) => void
  closeDrawer: () => void
  setLoading: (loading?: boolean) => void
  setConfirmLoading: (loading?: boolean) => void
}

export type RegisterFn = (action: BasicDrawerActionType, uid: number) => void

export type UseDrawerReturnType = [RegisterFn, ExtraBasicDrawerActionType]

export type UseDrawerInnerReturnType = [RegisterFn, Omit<ExtraBasicDrawerActionType, 'openDrawer'>]
