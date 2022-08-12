import type { ContextMenuProps, CreateContextMenuOptions } from './typing'

import { createVNode, render } from 'vue'
import ContextMenuConstructor from './ContextMenu.vue'
import { globalAppContext } from '../../registerGlobalComp'

const contextMenuManager: { domList: Element[]; resolve: Fn } = {
  domList: [],
  resolve: () => {},
}

// record
let seed = 1

export function createContextMenu(opt: CreateContextMenuOptions) {
  const { event } = opt || {}

  event && event.preventDefault()

  return new Promise((resove) => {
    const body = document.body

    const container = document.createElement('div')
    container.setAttribute('id', `context-menu-${seed++}`)

    const propsData: Partial<ContextMenuProps> = {}
    if (opt.width) {
      propsData.width = opt.width
    }

    if (opt.offset !== undefined) {
      propsData.offset = opt.offset
    }

    if (opt.style) {
      propsData.customStyle = opt.style
    }

    if (opt.items) {
      propsData.items = opt.items
    }

    if (event) {
      propsData.customEvent = event
      propsData.axis = { x: event.clientX, y: event.clientY }
    }

    const vm = createVNode(ContextMenuConstructor, propsData)
    // https://github.com/element-plus/element-plus/blob/dev/packages/components/message-box/src/messageBox.ts#L41
    vm.appContext = globalAppContext
    render(vm, container)

    const handleClick = function () {
      contextMenuManager.resolve('')
    }

    // remove dom each
    const remove = function () {
      contextMenuManager.domList.forEach((dom) => {
        try {
          // since the element is destroy, then the VNode should be collected by GC as well
          // we do not want cause any mem leak because we have returned vm as a reference to users
          // so that we manually set it to false.
          render(null, dom)
          // remove container
          body.removeChild(dom)
        } catch (e) {}
      })

      body.removeEventListener('click', handleClick)
      body.removeEventListener('scroll', handleClick)
    }

    // remove pre
    remove()

    // add
    contextMenuManager.domList.push(container)
    contextMenuManager.resolve = function (arg) {
      remove()
      resove(arg)
    }

    body.appendChild(container)
    body.addEventListener('click', handleClick)
    body.addEventListener('scroll', handleClick)
  })
}

export function destoryContextMenu() {
  if (contextMenuManager) {
    contextMenuManager.resolve('')
    contextMenuManager.domList = []
  }
}
