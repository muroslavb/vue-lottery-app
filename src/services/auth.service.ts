import { http } from '@/api/http-client'
import { ACCESS_TOKEN_TTL_MINUTES } from '@/constants'
import type { AuthTokens, LoginCredentials, LoginResponse } from '@/types/auth'
import type { User } from '@/types/user'
import type { AuthRepository } from './interfaces'

export class AuthService implements AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: ACCESS_TOKEN_TTL_MINUTES }),
    })
  }

  /** Захищений endpoint: потрібен заголовок Authorization: Bearer <accessToken>. */
  getCurrentUser(): Promise<User> {
    return http<User>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: ACCESS_TOKEN_TTL_MINUTES }),
    })
  }
}
