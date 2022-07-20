import type { ColProps, FormItemRule } from 'element-plus'
import type { VNodeChild, Component, ExtractPropTypes } from 'vue'
import { basicProps } from './props'
import type { SizeType } from '/#/config'

export interface RenderCallbackParams {
  schema: FormSchema
  values: Recordable
  model: Recordable
  prop: string
}

export type RenderFunction = (params: RenderCallbackParams) => VNodeChild

export type BasicFormProps = ExtractPropTypes<typeof basicProps>

export interface FormSchema {
  // prop name
  prop?: string
  // label
  label?: string
  // label width
  labelWidth?: string | number
  // required
  required?: boolean | ((params: RenderCallbackParams) => boolean)
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
  // variable name bound to v-model default value
  valueProp?: string
  // default value
  defaultValue?: any
  // form item hidden
  hidden?: boolean
  // component string will be using resolveComponent handle, need global register component
  component?: string | RenderFunction | Component
  // component props
  componentProps?: Recordable | ((params: RenderCallbackParams) => Recordable)
  // slot in basic form
  slot?: string
  // el-col props
  colProps?: Partial<Writable<ColProps>>
}
