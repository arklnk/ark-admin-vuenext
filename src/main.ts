import 'normalize.css/normalize.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:windi.css'
import 'virtual:svg-icons-register'

import '/@/styles/index.scss'

import { createApp } from 'vue'
import App from './App.vue'

import { registerGlobalComp } from '/@/core/registerGlobalComp'
import { initAppConfig } from '/@/core/initAppConfig'
import { setupStore } from './stores'
import { setupRouter } from '/@/router'

async function bootstrap() {
  const app = createApp(App)

  // store
  setupStore(app)

  // init appconfig
  initAppConfig()

  // register global component and lib
  registerGlobalComp(app)

  // setup router
  setupRouter(app)

  // mount
  app.mount('#app')
}

bootstrap()
