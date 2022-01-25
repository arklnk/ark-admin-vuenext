import 'normalize.css/normalize.css'
import 'element-plus/dist/index.css'
import 'virtual:windi.css'

import { createApp } from 'vue'
import App from './App.vue'
import { registerGlobalComp } from '/@/components/registerGlobalComp'
import { setupStore } from './stores'
import { setupRouter } from '/@/router'

async function bootstrap() {
  const app = createApp(App)

  // store
  setupStore(app)

  // register global component and lib
  registerGlobalComp(app)

  // setup router
  setupRouter(app)

  // mount
  app.mount('#app')
}

bootstrap()
