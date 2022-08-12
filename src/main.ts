import 'normalize.css/normalize.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'uno.css'
import 'virtual:svg-icons-register'
import '/@/styles/index.scss'

import { createApp } from 'vue'

import { registerGlobalComp } from '/@/logics/registerGlobalComp'
import { setupGlobalDirectives } from '/@/logics/setupGlobalDirectives'
import { initAppConfig } from '/@/logics/initAppConfig'
import { router, setupRouter } from '/@/router'
import { setupRouterGuard } from '/@/router/guard'
import { setupStore } from '/@/stores'
import { setupI18n } from '/@/locales/setupI18n'

import App from './App.vue'

async function bootstrap() {
  const app = createApp(App)

  // store
  setupStore(app)

  // init appconfig
  initAppConfig()

  // register global component and lib
  registerGlobalComp(app)

  // init i18n
  await setupI18n(app)

  // setup router
  setupRouter(app)

  // setup router guard
  setupRouterGuard(router)

  // global directive
  setupGlobalDirectives(app)

  // mount
  app.mount('#app')
}

bootstrap()
