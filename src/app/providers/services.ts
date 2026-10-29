import { AuthService } from '@/entities/session/api/auth.service'
import { UserService } from '@/entities/user/api/user.service'
import { ServiceProvider } from '@/shared/api/service-provider'

/** Реєстрація сервісів: шар app може залежати від усіх шарів, тому саме тут їх "збирають". */
export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService())
  ServiceProvider.register('auth', () => new AuthService())
}
