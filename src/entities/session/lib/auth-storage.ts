import { AUTH_STORAGE_KEY } from '@/shared/config'
import type { AuthSession } from '../model/types'

function isSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.accessToken === 'string' &&
    typeof candidate.refreshToken === 'string' &&
    typeof candidate.user === 'object' &&
    candidate.user !== null
  )
}

/** Відновлення сесії з localStorage. Пошкоджені дані не ламають застосунок. */
export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed: unknown = JSON.parse(raw)
    return isSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveSession(session: AuthSession): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  } catch {
    // localStorage недоступний - сесія житиме лише в пам'яті
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // нічого робити
  }
}
