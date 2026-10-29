import { http } from '@/shared/api/http-client'
import { ACCESS_TOKEN_TTL_MINUTES } from '@/shared/config/constants'
import type { AuthTokens, LoginCredentials, LoginResponse } from '../model/types'
import type { User } from '@/entities/user/model/types'
import type { AuthRepository } from '@/shared/api/interfaces'

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
