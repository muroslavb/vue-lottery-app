import type { CreateUserDto, User } from '@/types/user'

export function getFullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`
}

/** Чи підходить користувач під пошуковий запит (як пошук на сервері: за іменем, логіном, email). */
export function matchesQuery(user: User, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return true
  }
  const haystack = `${user.firstName} ${user.lastName} ${user.username} ${user.email}`
  return haystack.toLowerCase().includes(normalized)
}

/** User -> значення форми редагування. */
export function toFormValues(user: User): CreateUserDto {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    password: user.password ?? '',
    age: user.age,
    gender: user.gender,
    phone: user.phone,
  }
}

/** Безпечний шлях для редіректу після логіну: лише внутрішні адреси (захист від open redirect). */
export function getSafeRedirect(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }
  return value.startsWith('/') && !value.startsWith('//') ? value : null
}
