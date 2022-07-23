import type { BasicFormProps, FormSchema, RenderCallbackParams } from '../typing'
import type { FormItemProp, FormItemRule } from 'element-plus'

import { computed, defineComponent, unref, resolveComponent } from 'vue'
import { get, isBoolean, isFunction, upperFirst } from 'lodash-es'
import { getSlot } from '/@/utils/helper/tsx'
import { error } from '/@/utils/log'

export default defineComponent({
  name: 'BasicFormItem',
  inheritAttrs: false,
  props: {
    schema: {
      type: Object as PropType<FormSchema>,
      default: () => ({}),
    },
    formProps: {
      type: Object as PropType<BasicFormProps>,
      default: () => ({}),
    },
    formModel: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    setPropValue: {
      type: Function as PropType<(prop: FormItemProp, value: any) => void>,
      default: null,
    },
  },
  setup(props, { slots }) {
    // dynamic params
    const getParams = computed((): RenderCallbackParams => {
      const { schema, formModel } = props

      return {
        prop: schema.prop,
        model: formModel,
        schema,
      }
    })

    const getComponentProps = computed((): Recordable => {
      const { schema } = props
      let { componentProps = {} } = schema

      // function exec
      if (isFunction(componentProps)) {
        componentProps = componentProps(unref(getParams))
      }
      return componentProps
    })

    function processRules(): Arrayable<FormItemRule> {
      const { rules = [] } = props.schema

      // function exec
      if (isFunction(rules)) {
        return rules(unref(getParams))
      }
      return rules
    }

    function getItemHidden(): boolean {
      const { hidden } = props.schema

      if (isBoolean(hidden)) return hidden

      if (isFunction(hidden)) return hidden(unref(getParams))

      return false
    }

    function renderComponent() {
      const {
        component,
        slot: slotName,
        size,
        modelField = 'modelValue',
        changeEvent = 'change',
        prop,
      } = props.schema

      // 插槽
      if (slotName) {
        return getSlot(slots, slotName, unref(getParams))
      }

      if (!component) {
        error('component or slot is empty')
        return null
      }

      // render function
      if (isFunction(component)) {
        return component(unref(getParams))
      }

      // global component
      const Comp = resolveComponent(component) as any

      if (typeof Comp === 'string') {
        error(`could not resolve component name: ${Comp}`)
        return null
      }

      const propsData: Recordable = {
        ...unref(getComponentProps),
        size,
      }

      // like v-model support
      const eventKey = `on${upperFirst(changeEvent)}`
      const on = {
        [eventKey]: (...args: Nullable<Recordable>[]) => {
          if (propsData[eventKey] && isFunction(propsData[eventKey])) {
            propsData[eventKey](...args)
          }
          const [v] = args || []
          props.setPropValue(prop, v)
        },
      }
      const bindValue: Recordable = {
        [modelField]: get(props.formModel, prop),
      }

      const compAttr: Recordable = {
        ...propsData,
        ...on,
        ...bindValue,
      }
      return <Comp {...compAttr}></Comp>
    }

    // render form item
    function renderItem() {
      const { prop, label, labelWidth, required, error, showMessage, inlineMessage, size } =
        props.schema

      return (
        <el-form-item
          prop={prop}
          label={label}
          labelWidth={labelWidth}
          required={required}
          rules={processRules()}
          error={error}
          showMessage={showMessage}
          inlineMessage={inlineMessage}
          size={size}
        >
          {renderComponent()}
        </el-form-item>
      )
    }

    return () => {
      const { colProps } = props.schema
      const isHidden = getItemHidden()

      return !isHidden && <el-col {...colProps}>{renderItem()}</el-col>
    }
  },
})
