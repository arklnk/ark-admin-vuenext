import type { ColProps, FormItemRule, FormItemProp } from 'element-plus'
import type { ExtractPropTypes, Component } from 'vue'
import { basicProps } from './props'
import type { SizeType } from '/#/config'

export interface RenderCallbackParams {
  schema: FormSchema
  model: Recordable
  prop: FormItemProp
}

export type BasicFormProps = Partial<ExtractPropTypes<typeof basicProps>>

export interface FormSchema {
  // prop name
  prop: FormItemProp
  // label
  label?: string
  // label width
  labelWidth?: string | number
  // required
  required?: boolean | ((params: RenderCallbackParams) => boolean)
  // validate rules
  rules?: Arrayable<FormItemRule> | ((params: RenderCallbackParams) => Arrayable<FormItemRule>)
  // error tips
  error?: string
  // show validate error message
  showMessage?: boolean
  // inline show message
  inlineMessage?: boolean
  // size
  size?: SizeType
  // extend config
  helpMessage?: string | ((params: RenderCallbackParams) => string)
  // variable name bound to v-model default value, default modelValue
  modelField?: string
  // event name triggered by internal value change, default change
  changeEvent?: string
  // default value
  defaultValue?: any
  // form item hidden
  hidden?: boolean | ((params: RenderCallbackParams) => boolean)
  // component string will be using resolveComponent handle, need global register component
  component?: string | Component
  // render function
  render?: (params: RenderCallbackParams) => VueNode
  // render component slot
  renderComponentContent?:
    | ((params: RenderCallbackParams) => Recordable<(...args: any[]) => VueNode>)
    | VueNode
  // component props
  componentProps?: Recordable | ((params: RenderCallbackParams) => Recordable)
  // will merge to componentProps
  disabled?: boolean | ((params: RenderCallbackParams) => boolean)
  // slot in basic form
  slot?: string
  // el-col props
  colProps?: Partial<Writable<ColProps>>
}

export interface BasicFormActionType {
  validate: () => Promise<void>
  validateField: (props?: Arrayable<FormItemProp>) => Promise<void>
  resetFields: () => Promise<void>
  scrollToField: (prop: FormItemProp) => void
  clearValidate: (props?: Arrayable<FormItemProp>) => void

  // extra
  setFormModel: (values: Recordable) => void
  setProps: (formProps: Partial<BasicFormProps>) => void
  getFieldsValue: () => Recordable
  resetSchema: (schema: Arrayable<FormSchema>) => void
  updateSchema: (schema: Arrayable<Partial<FormSchema>>) => void
  removeSchemaByProp: (props: FormItemProp[]) => void
  appendSchemaByProp: (schema: FormSchema, prop?: FormItemProp, first?: boolean) => void
  submit: () => Promise<void>
}

export type RegisterFn = (formInstance: BasicFormActionType) => void

export type UseFormReturnType = [RegisterFn, BasicFormActionType]
