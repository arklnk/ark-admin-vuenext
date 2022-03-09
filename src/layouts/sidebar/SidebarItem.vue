<script lang="tsx">
import type { VNode } from 'vue'

import { defineComponent } from 'vue'

const props = {
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
}

export default defineComponent({
  name: 'SidebarItem',
  props,
  setup(props) {
    const vnodes: VNode[] = []
    if (props.icon) {
      vnodes.push(<svg-icon icon={props.icon} title={props.title} />)
    }
    if (props.title) {
      vnodes.push(<span v-slots:title>{props.title}</span>)
    }
    return () => vnodes
  }
})
</script>
