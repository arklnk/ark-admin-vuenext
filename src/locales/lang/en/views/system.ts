export default {
  menu: {
    parent: 'Parent menu',
    name: 'Menu name',
    type: 'Type',
    icon: 'Icon',
    isShow: 'Status',
    router: 'Router',
    viewPath: 'View path',
    perm: 'Permissions',
    orderNum: 'Sort',

    // menu type
    menuTypeCatalogue: 'Catalogue',
    menuTypeMenu: 'Menu',
    menuTypePermission: 'Permission',

    // show state
    menuHidden: 'Hidden',

    editform: {
      title: 'Edit menu',
    },
  },

  role: {
    name: 'Role name',
    uniqueKey: 'Unique id',

    editform: {
      title: 'Edit role',
      parent: 'Parent role',
      permissionAssign: 'Permission assign',
    },
  },

  dept: {
    name: 'Dept name',
    fullname: 'Dept full name',
    code: 'Dept code',
    type: 'Dept type',

    deptTypeCompany: 'Company',
    deptTypeSubsidiary: 'Subsidiary',
    deptTypeDepartment: 'Department',

    editform: {
      title: 'Edit dept',
      parent: 'Parent Dept',
    },
  },

  job: {
    name: 'Job name',

    editform: {
      title: 'Edit job',
    },
  },

  profession: {
    name: 'Profession name',

    editform: {
      title: 'Edit Profession',
    },
  },

  user: {
    deptStruct: 'Department Structure',

    account: 'Account',
    username: 'Username',
    nickname: 'Nickname',
    avatar: 'Avatar',
    gender: 'Gender',
    birthday: 'Birthday',
    email: 'Email',
    mobile: 'Mobile',
    profession: 'Profession',
    job: 'Job',
    dept: 'Department',
    roles: 'Roles',

    editform: {
      title: 'Edit userinfo',
    },
  },
}
