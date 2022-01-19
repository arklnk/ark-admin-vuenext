import 'element-plus/dist/index.css'
import 'virtual:windi.css'

import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugin } from '/@/core/use'

async function bootstrap() {
  const app = createApp(App)

  // register plugin
  registerPlugin(app)

  // mount
  app.mount('#app')
}

bootstrap()