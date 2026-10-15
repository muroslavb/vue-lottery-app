import { createPinia } from 'pinia'
import { createApp } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.scss'
import { registerAuthBridge } from './api/http-client'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
app.use(createPinia())

// з'єднуємо HTTP-клієнт зі сховищем авторизації (interceptor оновлення токена)
const auth = useAuthStore()
registerAuthBridge({
  getAccessToken: () => auth.accessToken,
  refreshTokens: () => auth.refreshSession(),
  onSessionExpired: () => {
    auth.logout()
    const current = router.currentRoute.value
    if (current.name !== 'login') {
      void router.push({ name: 'login', query: { redirect: current.fullPath } })
    }
  },
})

app.use(router)
app.mount('#app')

if (auth.isAuthenticated) {
  void auth.restoreSession()
}
