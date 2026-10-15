export const REQUIRED_MESSAGE = 'This value is required.'

export const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Телефон: код країни +380 і рівно 9 цифр. */
export const PHONE_REGEXP = /^\+380\d{9}$/
const ISO_DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/

const MIN_BIRTH_YEAR = 1900

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEXP.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  return PHONE_REGEXP.test(value.trim())
}

/** Сьогоднішня дата за локальним часом у форматі yyyy-mm-dd. */
export function toLocalIsoDate(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Перевіряє, що рядок - існуюча календарна дата у форматі yyyy-mm-dd (а не, наприклад, 2020-02-31). */
export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_REGEXP.test(value)) {
    return false
  }
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

export function isFutureDate(value: string, today: string = toLocalIsoDate()): boolean {
  // рядки yyyy-mm-dd порівнюються лексикографічно так само, як і хронологічно
  return value > today
}

/** Усі validate* повертають текст помилки або порожній рядок, якщо значення коректне. */
export function validateName(value: string): string {
  return isRequired(value) ? '' : REQUIRED_MESSAGE
}

export function validateBirthDate(value: string, today: string = toLocalIsoDate()): string {
  if (!isRequired(value)) {
    return REQUIRED_MESSAGE
  }
  if (!isValidIsoDate(value) || Number(value.slice(0, 4)) < MIN_BIRTH_YEAR) {
    return 'Enter a valid date (yyyy-mm-dd).'
  }
  if (isFutureDate(value, today)) {
    return 'Date of birth cannot be in the future.'
  }
  return ''
}

export function validateEmail(value: string, isTaken?: (email: string) => boolean): string {
  if (!isRequired(value)) {
    return REQUIRED_MESSAGE
  }
  if (!isValidEmail(value)) {
    return 'Enter a valid email address.'
  }
  if (isTaken?.(value.trim())) {
    return 'A participant with this email already exists.'
  }
  return ''
}

export function validatePhone(value: string): string {
  if (!isRequired(value)) {
    return REQUIRED_MESSAGE
  }
  if (!isValidPhone(value)) {
    return 'Phone must be in the format +380XXXXXXXXX.'
  }
  return ''
}
