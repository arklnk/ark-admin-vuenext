export default {
  appName: 'Ark Admin',

  // http util
  http: {
    errorTip: 'Error tip',
    requestFailed: 'The interface request failed, please try again later!',
    requestTimeout: 'The interface request timed out, please refresh the page and try again!',
    networkException: 'Please check if your network connection is normal! The network is abnormal',

    errMsg403: 'The user is authorized, but access is forbidden!',
    errMsg404: 'Network request error, the resource was not found!',
    errMsg405: 'Network request error, request method not allowed!',
    errMsg500: 'Server error, please contact the administrator!',
    errMsg503: 'The service is unavailable, the server is temporarily overloaded or maintained!',
  },

  exception: {
    // page 404
    backHome: 'Back homepage',
    pageNotFound: 'Page not found',
    pageNotFoundDesc:
      'Please check whether the link is entered correctly or click the button to return to the home page',

    // view not impl
    dynamicImport: 'Page dynamic loading failed',
    dynamicImportDesc:
      'Please check whether the file in the corresponding dynamic load page path exists',
  },

  // login page
  login: {
    oslink: 'Github Link',
    signin: 'Sign in',
    account: 'Username',
    passwd: 'Password',
    captcha: 'Captcha',
  },

  basic: {
    add: 'Add',
    update: 'Update',
    delete: 'Delete',
    query: 'Query',
    save: 'Save',
    reset: 'Reset',
    search: 'Search',
    operation: 'Operation',
    edit: 'Edit',
    confirm: 'Confirm',
    submit: 'Submit',

    show: 'Show',
    hidden: 'Hidden',

    ok: 'Ok',
    cancel: 'Cancel',
    close: 'Close',
    redo: 'Refresh',
    back: 'Back',
    loading: 'Loading...',
  },
}
