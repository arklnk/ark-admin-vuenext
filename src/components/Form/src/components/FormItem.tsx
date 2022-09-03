import type { BasicFormProps, FormSchema, RenderCallbackParams } from '../typing'
import type { FormItemProp, FormItemRule } from 'element-plus'

import { computed, defineComponent, unref, resolveComponent } from 'vue'
import { get, isBoolean, isFunction, upperFirst } from 'lodash-es'
import { getSlot } from '/@/utils/helper/tsx'
import { error } from '/@/utils/log'
import { Warning } from '@element-plus/icons-vue'

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
        slot: slotName,
        render,
        size,
        modelField = 'modelValue',
        changeEvent = 'update:modelValue',
        prop,
      } = props.schema

      // slot
      if (slotName) {
        return getSlot(slots, slotName, unref(getParams))
      }

      // render function
      if (isFunction(render)) {
        return render(unref(getParams))
      }

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
      return <Comp {...compAttr}></Comp>
    }

    function renderLabel() {
      const { label, helpMessage } = props.schema

      const helpMessageStr = isFunction(helpMessage) ? helpMessage(unref(getParams)) : helpMessage

      return (
        <span class="inline-flex flex-row items-center">
          {label}
          {helpMessageStr ? (
            <el-tooltip content={helpMessageStr} placement="right">
              <el-icon class="mx-1">
                <Warning />
              </el-icon>
            </el-tooltip>
          ) : null}
        </span>
      )
    }

    // render form item
    function renderItem() {
      const { prop, label, labelWidth, required, error, showMessage, inlineMessage, size } =
        props.schema

      // process
      const isRequired = isFunction(required) ? required(unref(getParams)) : required

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
            default: () => renderContent(),
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
