import type { BasicFormProps, FormSchema, RenderCallbackParams } from '../typing'
import type { FormItemProp, FormItemRule } from 'element-plus'

import { computed, defineComponent, unref, resolveComponent } from 'vue'
import { get, isBoolean, isFunction, upperFirst } from 'lodash-es'
import { getSlot } from '/@/utils/helper/tsx'
import { error } from '/@/utils/log'
import { BasicHeading } from '/@/components/Heading'

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
      let { componentProps = {} } = props.schema

      // function exec
      if (isFunction(componentProps)) {
        componentProps = componentProps(unref(getParams)) ?? {}
      }

      return componentProps
    })

    const getDisabled = computed((): boolean => {
      const { disabled: globalDisabled } = props.formProps
      const { disabled: schemaDisabled } = props.schema
      const { disabled: propsDisabled = false } = unref(getComponentProps)

      if (isBoolean(schemaDisabled)) {
        return schemaDisabled
      }
      if (isFunction(schemaDisabled)) {
        return schemaDisabled(unref(getParams))
      }

      return !!globalDisabled || propsDisabled
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

    /**
     * render content
     * slot > render > component
     */
    function renderContent() {
      const {
        component,
        renderComponentContent,
        size,
        modelField = 'modelValue',
        changeEvent = 'update:modelValue',
        prop,
      } = props.schema

      // render component
      if (!component) {
        return null
      }

      const Comp: any = typeof component === 'string' ? resolveComponent(component) : component
      // is not a global component
      if (typeof Comp === 'string') {
        error(`could not resolve component: ${Comp}`)
      }

      const propsData: Recordable = {
        ...unref(getComponentProps),
        size,
        disabled: unref(getDisabled),
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

      if (!renderComponentContent) return <Comp {...compAttr} />

      const compSlot = isFunction(renderComponentContent)
        ? { ...renderComponentContent(unref(getParams)) }
        : {
            default: () => renderComponentContent,
          }

      return <Comp {...compAttr} v-slots={compSlot} />
    }

    function renderLabel() {
      const { label, helpMessage } = props.schema

      const helpMessageStr = isFunction(helpMessage) ? helpMessage(unref(getParams)) : helpMessage

      return <BasicHeading helpMessage={helpMessageStr} title={label} />
    }

    // render form item
    function renderItem() {
      const {
        prop,
        label,
        labelWidth,
        required,
        error,
        showMessage,
        inlineMessage,
        size,
        render,
        slot,
      } = props.schema

      // process
      const isRequired = isFunction(required) ? required(unref(getParams)) : required

      const getContent = () => {
        // slot
        if (slot) {
          return getSlot(slots, slot, unref(getParams))
        }

        // render function
        if (isFunction(render)) {
          return render(unref(getParams))
        }

        return renderContent()
      }

      return (
        <el-form-item
          prop={prop}
          label={label}
          labelWidth={labelWidth}
          required={isRequired}
          rules={processRules()}
          error={error}
          showMessage={showMessage}
          inlineMessage={inlineMessage}
          size={size}
        >
          {{
            default: () => getContent(),
            label: () => renderLabel(),
          }}
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
