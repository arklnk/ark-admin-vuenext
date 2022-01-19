import 'element-plus/dist/index.css'
import 'virtual:windi.css'

import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugin } from '/@/core/use'
import { setupStore } from '/@/store'

async function bootstrap() {
  const app = createApp(App)

  // store
  setupStore(app)

  // register plugin
  registerPlugin(app)

  // mount
  app.mount('#app')
}

bootstrap()
