import type { FormItemRule } from 'element-plus'
import type { VNodeChild } from 'vue'
import type { SizeType } from '/#/config'

export type RenderFunction = () => VNodeChild

export interface FormSchema {
  // field name
  field?: string
  // label
  label?: string
  // label width
  labelWidth?: string | number
  // required
  required?: boolean
  // validate rules
  rules?: Arrayable<FormItemRule>
  // error tips
  error?: string
  // show validate error message
  showMessage?: boolean
  // inline show message
  inlineMessage?: boolean
  // size
  size?: SizeType

  // extend config

  // form item hidden
  hidden?: boolean
  // component
  component?: string | RenderFunction
  // component props
  componentProps?: Recordable | ((opt: { schema: FormSchema; model: Recordable }) => Recordable)
  // slot in basic form
  slot?: string
}

export interface BasicFormProps {
  model?: Recordable
}
