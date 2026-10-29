export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/** Коротка інформація про користувача, що зберігається в сторі після логіну. */
export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image?: string
}

export type LoginResponse = AuthUser & AuthTokens

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken: string
}
