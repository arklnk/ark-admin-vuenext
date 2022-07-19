export interface FormSchema {
  // field name
  prop: string
  // label
  label: string
  // component
  component?: string | VueNode
  // slot in basic form
  slot?: string
}

export interface BasicFormProps {
  model?: Recordable
}
