import 'normalize.css/normalize.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:windi.css'
import 'virtual:svg-icons-register'

import '/@/styles/index.scss'
import { createApp } from 'vue'
import { registerGlobalComp } from '/@/logics/registerGlobalComp'
import { initAppConfig } from '/@/logics/initAppConfig'
import { setupStore } from '/@/stores'
import { setupRouter } from '/@/router'

import App from './App.vue'

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
