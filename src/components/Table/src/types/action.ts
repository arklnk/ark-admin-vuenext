import type { ButtonProps, PopconfirmProps } from '/@/components/Button'
import { RoleEnum } from '/@/enums/roleEnum'

export interface TableActionItem extends ButtonProps {
  onClick?: Fn
  // 按钮文本
  label?: string
  // 权限控制是否显示，隐藏元素并非按钮禁用
  permission?: RoleEnum | RoleEnum[] | string | string[]
  // 分割线
  divider?: boolean
  // 是否需要隐藏
  hidden?: boolean | ((item: TableActionItem) => boolean)
  // 是否需要使用PopconfirmButton，如果为dropdown是会使用MessageBox代替
  popconfirm?: boolean | PopconfirmProps
  // Vue需要用到的key，当label重复时需要使用key来区分，优先使用key后使用label
  key?: string
}
