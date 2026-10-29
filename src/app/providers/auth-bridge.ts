import type { Router } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { registerAuthBridge } from '@/shared/api'

/**
 * З'єднує HTTP-клієнт (shared) зі store сесії (entities): interceptor 401 бере токен,
 * оновлює його і при невдачі виходить із сесії та перенаправляє на login.
 * Викликається після app.use(pinia).
 */
export function setupAuthBridge(router: Router): void {
  const session = useSessionStore()

  registerAuthBridge({
    getAccessToken: () => session.accessToken,
    refreshTokens: () => session.refreshSession(),
    onSessionExpired: () => {
      session.clearSession()
      const current = router.currentRoute.value
      if (current.name !== 'login') {
        void router.push({ name: 'login', query: { redirect: current.fullPath } })
      }
    },
  })
}
