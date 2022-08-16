export default {
  appName: '方舟管理后台',

  // http util
  http: {
    errorTip: '错误提示',
    requestFailed: '请求出错,请稍候重试!',
    requestTimeout: '接口请求超时,请刷新页面重试!',
    networkException: '网络异常，请检查您的网络连接是否正常!',

    errMsg403: '用户得到授权，但是访问是被禁止的!',
    errMsg404: '网络请求错误,未找到该资源!',
    errMsg405: '网络请求错误,请求方法未允许!',
    errMsg500: '服务器错误,请联系管理员!',
    errMsg503: '服务不可用，服务器暂时过载或维护!',
  },

  exception: {
    // page 404
    backHome: '返回首页',
    pageNotFound: '页面没有找到',
    pageNotFoundDesc: '请检查链接是否输入正确, 或点击按钮返回首页',

    // view not impl
    dynamicImport: '页面动态载入失败',
    dynamicImportDesc: '请检查对应动态载入页面路径下的文件是否存在',
  },

  // login page
  login: {
    oslink: '开源地址',
    signin: '登录',
    account: '用户名',
    passwd: '密码',
    captcha: '验证码',
  },

  basic: {
    create: '新增',
    update: '更新',
    delete: '删除',
    query: '查询',
    save: '保存',
    reset: '重置',
    search: '搜索',

    ok: '确认',
    cancel: '取消',
    close: '关闭',
    redo: '刷新',
    back: '返回',
    loading: '加载中...',
  },
}
