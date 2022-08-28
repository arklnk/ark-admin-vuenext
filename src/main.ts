import '@unocss/reset/tailwind.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'uno.css'
import '/@/styles/index.scss'

import { createApp } from 'vue'
import { registerGlobalComp } from '/@/components/registerGlobalComp'
import { setupGlobalDirectives } from '/@/directives/setupGlobalDirectives'
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

  // setup i18n
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
