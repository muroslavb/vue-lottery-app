import { createApp } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/app/styles/main.scss'
import App from '@/app/App.vue'
import { setupAuthBridge } from '@/app/providers/auth-bridge'
import { setupPinia } from '@/app/providers/pinia'
import { setupUi } from '@/app/providers/ui'
import router from '@/app/providers/router/index'
import { registerServices } from '@/app/providers/services'
import { useSessionStore } from '@/entities/session/model/session.store'

registerServices()

const app = createApp(App)
app.use(setupPinia())
setupUi(app)
setupAuthBridge(router)
app.use(router)
app.mount('#app')

const session = useSessionStore()
if (session.isAuthenticated) {
  void session.restoreSession()
}
