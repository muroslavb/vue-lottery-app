import type { User } from '@/entities/user/model/types'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/** Коротка інформація про користувача, що зберігається в сторі після логіну. */
export type AuthUser = Pick<
  User,
  'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'gender' | 'image'
>

export type LoginResponse = AuthUser & AuthTokens

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken: string
}
