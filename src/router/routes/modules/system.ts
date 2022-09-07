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
          title: '官方文档(内嵌)',
          icon: 'carbon:application-web',
          iframeSrc: 'https://docs.arklnk.com/',
        },
      },
    ],
  },
])
