import 'normalize.css/normalize.css'
import 'element-plus/dist/index.css'
import 'virtual:windi.css'

import '/@/styles/index.scss'

import { createApp } from 'vue'
import App from './App.vue'
import { registerGlobalComp } from '/@/components/registerGlobalComp'
import { setupStore } from './stores'
import { setupRouter } from '/@/router'
import { initAppConfigStore } from '/@/core/initAppConfig'

async function bootstrap() {
  const app = createApp(App)

  // store
  setupStore(app)

  // init appconfig
  initAppConfigStore()

  // register global component and lib
  registerGlobalComp(app)

  // setup router
  setupRouter(app)

  // mount
  app.mount('#app')
}

bootstrap()
