import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { HttpError, ServiceProvider } from '@/shared/api'
import type { AuthService } from '../api/auth.service'
import type { AuthSession, AuthTokens, AuthUser, LoginCredentials } from './types'
import { clearSession as removeStoredSession, loadSession, saveSession } from '../lib/auth-storage'
import { getErrorMessage } from '@/shared/lib'

/**
 * Store сесії (setup store): токени, поточний користувач, ознака авторизації.
 * Синхронізація з localStorage реалізована вручну (watch) - порівняння з
 * pinia-plugin-persistedstate див. у README.
 */
export const useSessionStore = defineStore('session', () => {
  const service = () => ServiceProvider.get<AuthService>('auth')

  // state: відновлення сесії з localStorage при завантаженні застосунку
  const saved = loadSession()
  const user = ref<AuthUser | null>(saved?.user ?? null)
  const accessToken = ref<string | null>(saved?.accessToken ?? null)
  const refreshToken = ref<string | null>(saved?.refreshToken ?? null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // getters
  const isAuthenticated = computed(() => accessToken.value !== null)

  // збереження в localStorage - watcher з опцією deep
  watch(
    [user, accessToken, refreshToken],
    () => {
      if (user.value && accessToken.value && refreshToken.value) {
        saveSession({
          user: user.value,
          accessToken: accessToken.value,
          refreshToken: refreshToken.value,
        })
      } else {
        removeStoredSession()
      }
    },
    { deep: true },
  )

  // actions
  function setSession(session: AuthSession): void {
    user.value = session.user
    accessToken.value = session.accessToken
    refreshToken.value = session.refreshToken
  }

  function setTokens(tokens: AuthTokens): void {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
  }

  function clearSession(): void {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    error.value = null
  }

  /** Повертає true при успішному логіні; текст помилки лежить у error. */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const {
        accessToken: access,
        refreshToken: refresh,
        ...profile
      } = await service().login(credentials)
      setSession({ user: profile, accessToken: access, refreshToken: refresh })
      return true
    } catch (e) {
      error.value = getErrorMessage(e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout(): void {
    clearSession()
  }

  /** Оновлює пару токенів через POST /auth/refresh. Викликається interceptor-ом HTTP-клієнта. */
  async function refreshSession(): Promise<boolean> {
    if (!refreshToken.value) {
      return false
    }
    try {
      setTokens(await service().refresh(refreshToken.value))
      return true
    } catch {
      return false
    }
  }

  /** Перевіряє збережену сесію запитом GET /auth/me (з автоматичним оновленням токена). */
  async function restoreSession(): Promise<void> {
    try {
      const current = await service().getCurrentUser()
      user.value = {
        id: current.id,
        username: current.username,
        email: current.email,
        firstName: current.firstName,
        lastName: current.lastName,
        gender: current.gender,
        image: current.image,
      }
    } catch (e) {
      // 401 після невдалого refresh обробляє interceptor; мережеві помилки сесію не скидають
      if (e instanceof HttpError && e.status === 401) {
        clearSession()
      }
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    setSession,
    clearSession,
    login,
    logout,
    refreshSession,
    restoreSession,
  }
})
