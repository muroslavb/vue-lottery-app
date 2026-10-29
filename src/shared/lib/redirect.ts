/** Безпечний шлях для редіректу після логіну: лише внутрішні адреси (захист від open redirect). */
export function getSafeRedirect(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }
  return value.startsWith('/') && !value.startsWith('//') ? value : null
}
