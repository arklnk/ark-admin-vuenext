import type { BasicFormActionType, BasicFormProps } from '../typing'
import type { BasicDrawerProps, BasicDrawerActionType } from '/@/components/Drawer'
import type { ComponentInternalInstance, Ref, ExtractPropTypes } from 'vue'

import { BasicDrawer } from '/@/components/Drawer'
import BasicForm from '../BasicForm.vue'
import {
  unref,
  render,
  createVNode,
  nextTick,
  getCurrentInstance,
  onUnmounted,
  ref,
  defineComponent,
} from 'vue'
import { globalAppContext } from '/@/components/registerGlobalComp'
import { isFunction, merge } from 'lodash-es'

const basicProps = {
  formProps: {
    type: Object as PropType<BasicFormProps>,
  },
  drawerProps: {
    type: Object as PropType<BasicDrawerProps>,
  },
  submit: {
    type: Function as PropType<OnSubmitFn>,
  },
}

type OnSubmitFn = (res: Recordable, ist: FormDrawerInstance) => void | Promise<void>

type OnOpenFn = (ist: FormDrawerInstance) => void | Promise<void>

type FormDrawerProps = ExtractPropTypes<typeof basicProps>

interface FormDrawerInstance {
  open: (fn?: OnOpenFn) => void | Promise<void>
  close: () => void
  showLoading: () => void
  hideLoading: () => void
  getDrawerAction: () => Nullable<BasicDrawerActionType>
  getFormAction: () => Nullable<BasicFormActionType>
}

export function createFormDrawer(
  createProps?: Partial<FormDrawerProps>,
  fdRef?: Ref<Nullable<FormDrawerInstance>>
) {
  // 判断是否在setup中调用，用于判断是否能在生命周期中释放资源
  const isRunInSetup = !!getCurrentInstance()

  const container = document.createElement('div')
  let _componentInstance: ComponentInternalInstance | null = null

  function release() {
    // here we were suppose to call document.body.removeChild(container.firstElementChild)
    // but render(null, container) did that job for us. so that we do not call that directly
    render(null, container)

    _componentInstance = null
  }

  if (!isRunInSetup) {
    // hack onClosed hook to gc this dom
    function onClosed() {
      nextTick(() => {
        release()
      })
    }

    createProps = merge(createProps, { drawerProps: { onClosed } })
  } else {
    onUnmounted(() => {
      release()
    })
  }

  function getInstance(): Nullable<FormDrawerInstance> {
    if (fdRef) return unref(fdRef)

    // inited return
    if (!_componentInstance) {
      const vm = createVNode(BasicFormDrawer, createProps)
      vm.appContext = globalAppContext

      render(vm, container)
      document.body.appendChild(container.firstElementChild!)

      _componentInstance = vm.component!
    }

    return _componentInstance.exposed as Nullable<FormDrawerInstance>
  }

  return {
    open: (fn?: OnOpenFn) => {
      getInstance()?.open(fn)
    },
    close: () => {
      getInstance()?.close()
    },
    getDrawerAction: () => {
      return getInstance()?.getDrawerAction()
    },
    getFormAction: () => {
      return getInstance()?.getFormAction()
    },
    showLoading: () => {
      getInstance()?.showLoading()
    },
    hideLoading: () => {
      getInstance()?.hideLoading()
    },
  }
}

export const BasicFormDrawer = defineComponent({
  name: 'BasicFormDrawer',
  inheritAttrs: false,
  props: basicProps,
  setup(props, { expose, slots }) {
    const drawerRef = ref<Nullable<BasicDrawerActionType>>(null)
    const formRef = ref<Nullable<BasicFormActionType>>(null)

    const action = {
      getDrawerAction,
      getFormAction,
      open,
      close,
      showLoading,
      hideLoading,
    }

    function getDrawerAction() {
      return unref(drawerRef)
    }

    function getFormAction() {
      return unref(formRef)
    }

    // expose operate function
    function open(open?: OnOpenFn) {
      getDrawerAction()?.setProps({ visible: true })

      nextTick(() => {
        if (open && isFunction(open)) {
          open(action)
        }
      })
    }

    function close() {
      getDrawerAction()?.setProps({ visible: false })
    }

    function showLoading() {
      getDrawerAction()?.setProps({ loading: true, confirmBtnProps: { loading: true } })
    }

    function hideLoading() {
      getDrawerAction()?.setProps({ loading: false, confirmBtnProps: { loading: false } })
    }

    expose(action)

    return () => {
      const drawerProps = {
        destroyOnClose: true,
        ...(props.drawerProps || {}),
        onConfirm: unref(formRef)?.submit,
        onCancel: () => {
          //关闭时重置表单值
          unref(formRef)?.resetFields()
        },
      }

      // hook onSubmit
      function handleSubmit(res: Recordable) {
        if (props.submit && isFunction(props.submit)) {
          props.submit(res, action)
        }
      }

      const formProps = {
        ...(props.formProps || {}),
        showActionButtonGroup: false,
        onSubmit: handleSubmit,
      }

      return (
        <BasicDrawer ref={drawerRef} {...drawerProps}>
          <BasicForm ref={formRef} {...formProps} v-slots={slots} />
        </BasicDrawer>
      )
    }
  },
})
