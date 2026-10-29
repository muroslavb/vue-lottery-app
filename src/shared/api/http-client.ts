const BASE_URL: string = import.meta.env.VITE_API_URL

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/**
 * Міст між HTTP-клієнтом і сховищем авторизації. Клієнт нічого не знає про Pinia чи роутер -
 * сторінка-споживач (main.ts) реєструє ці функції один раз (інверсія залежностей).
 */
export interface AuthBridge {
  getAccessToken: () => string | null
  /** Оновлює токени через refreshToken. Повертає true, якщо вдалося. */
  refreshTokens: () => Promise<boolean>
  /** Викликається, коли оновити сесію не вдалося (потрібен повторний логін). */
  onSessionExpired: () => void
}

export interface HttpOptions extends RequestInit {
  /** true - додати заголовок Authorization: Bearer і спробувати оновити токен при 401. */
  auth?: boolean
}

let authBridge: AuthBridge | null = null
let refreshing: Promise<boolean> | null = null

export function registerAuthBridge(bridge: AuthBridge): void {
  authBridge = bridge
}

function buildHeaders(init: RequestInit, auth: boolean): Headers {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = auth ? authBridge?.getAccessToken() : null
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}

async function send(path: string, init: RequestInit, auth: boolean): Promise<Response> {
  if (!BASE_URL) {
    throw new Error('VITE_API_URL is not defined. Create a .env file (see .env.example).')
  }
  try {
    return await fetch(`${BASE_URL}${path}`, { ...init, headers: buildHeaders(init, auth) })
  } catch {
    throw new HttpError(0, 'Network error. Please check your connection.')
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json()
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const { message } = body as { message: unknown }
      if (typeof message === 'string' && message) {
        return message
      }
    }
  } catch {
    // тіло відповіді не JSON - беремо стандартний текст статусу
  }
  return `HTTP ${response.status}: ${response.statusText}`
}

/** Один спільний запит на оновлення токена, навіть якщо одночасно прийшло кілька відповідей 401. */
function refreshOnce(): Promise<boolean> {
  if (!authBridge) {
    return Promise.resolve(false)
  }
  refreshing ??= authBridge.refreshTokens().finally(() => {
    refreshing = null
  })
  return refreshing
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { auth = false, ...init } = options
  let response = await send(path, init, auth)

  // interceptor: при 401 пробуємо оновити accessToken і повторюємо запит один раз
  if (response.status === 401 && auth && authBridge) {
    if (await refreshOnce()) {
      response = await send(path, init, auth)
    } else {
      authBridge.onSessionExpired()
    }
  }

  if (!response.ok) {
    throw new HttpError(response.status, await readErrorMessage(response))
  }
  return (await response.json()) as T
}
