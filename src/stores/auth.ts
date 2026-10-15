import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { HttpError } from '@/api/http-client'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthUser, LoginCredentials } from '@/types/auth'
import { clearSession, loadSession, saveSession } from '@/utils/auth-storage'
import { getErrorMessage } from '@/utils/errors'

export const useAuthStore = defineStore('auth', () => {
  // відновлення сесії з localStorage при завантаженні застосунку
  const saved = loadSession()
  const user = ref<AuthUser | null>(saved?.user ?? null)
  const accessToken = ref<string | null>(saved?.accessToken ?? null)
  const refreshToken = ref<string | null>(saved?.refreshToken ?? null)

  const isLoading = ref(false)
  const error = ref<string | null>(null)

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
        clearSession()
      }
    },
    { deep: true },
  )

  /** Повертає true при успішному логіні; текст помилки лежить у error. */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const {
        accessToken: access,
        refreshToken: refresh,
        ...profile
      } = await ServiceProvider.auth.login(credentials)
      user.value = profile
      accessToken.value = access
      refreshToken.value = refresh
      return true
    } catch (e) {
      error.value = getErrorMessage(e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout(): void {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    error.value = null
  }

  /** Оновлює пару токенів через POST /auth/refresh. Використовується interceptor-ом HTTP-клієнта. */
  async function refreshSession(): Promise<boolean> {
    if (!refreshToken.value) {
      return false
    }
    try {
      const tokens = await ServiceProvider.auth.refresh(refreshToken.value)
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken
      return true
    } catch {
      return false
    }
  }

  /** Перевіряє збережену сесію запитом GET /auth/me (з автоматичним оновленням токена). */
  async function restoreSession(): Promise<void> {
    try {
      const current = await ServiceProvider.auth.getCurrentUser()
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
        logout()
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
    login,
    logout,
    refreshSession,
    restoreSession,
  }
})
