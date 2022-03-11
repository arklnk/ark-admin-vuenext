<script lang="tsx">
import type { VNode } from 'vue'

const BasicMenuItem = (props: {
  icon?: string
  title?: string
}) => {
  const vnodes: VNode[] = []
  if (props.icon) {
    vnodes.push(<svg-icon icon={props.icon} />)
  }
  if (props.title) {
    vnodes.push(<span v-slots:title>{props.title}</span>)
  }
  return vnodes
}

BasicMenuItem.props = ['icon', 'title']

export default BasicMenuItem
</script>
