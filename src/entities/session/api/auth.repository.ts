import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '../model/types'

/** Контракт репозиторія авторизації. */
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResponse>
  getCurrentUser(): Promise<AuthUser>
  refresh(refreshToken: string): Promise<AuthTokens>
}
