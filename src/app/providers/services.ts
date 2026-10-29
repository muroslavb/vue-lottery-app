import { AuthService } from '@/entities/session'
import { UserService } from '@/entities/user'
import { ServiceProvider } from '@/shared/api'

/** Реєстрація сервісів: шар app може залежати від усіх шарів, тому саме тут їх "збирають". */
export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService())
  ServiceProvider.register('auth', () => new AuthService())
}
