import { createApp } from 'vue'
import App from './App.vue'
import use from './core/use'

import 'element-plus/dist/index.css'
import 'virtual:windi.css'

const app = createApp(App)
use(app)
app.mount('#app')
