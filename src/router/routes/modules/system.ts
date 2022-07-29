import { IFrameLayout, ParentLayout } from '../../contants'
import { defineRoleModule } from '../../helper/defineModule'
// import { RoleEnum } from '/@/enums/roleEnum'

export default defineRoleModule([
  {
    path: '/docs',
    name: 'docs',
    component: ParentLayout,
    meta: {
      single: true,
    },
    children: [
      {
        path: '/docs/typeorm',
        name: 'docstypeorm',
        component: IFrameLayout,
        meta: {
          title: 'TypeOrm文档(内嵌)',
          icon: 'docs',
          iframeSrc: 'https://www.bookstack.cn/read/TypeORM-0.2.20-zh/README.md',
        },
      },
    ],
  },
])
