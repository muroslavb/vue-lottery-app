import { createPinia } from 'pinia'
import { createApp } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/app/styles/main.scss'
import { registerAuthBridge } from '@/shared/api/http-client'
import App from '@/app/App.vue'
import router from '@/app/providers/router/index'
import { useAuthStore } from '@/entities/session/model/auth.store'

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
