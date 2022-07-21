import type {
  BasicFormActionType,
  BasicFormProps,
  FormSchema,
  RenderCallbackParams,
} from '../typing'

import { computed, defineComponent } from 'vue'
import { isFunction } from 'lodash-es'

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
    defaultValues: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    formModel: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    formActionType: {
      type: Object as PropType<BasicFormActionType>,
    },
  },
  setup(props) {
    const getComponentProps = computed((): Recordable => {
      const { formModel, schema } = props
      let { componentProps = {} } = schema

      // execute
      if (isFunction(componentProps)) {
        componentProps = componentProps({
          schema,
          model: formModel,
        } as RenderCallbackParams)
      }

      return componentProps
    })

    // TODO return render function
    return {
      getComponentProps,
    }
  },
})
