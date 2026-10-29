import { useThemeStore } from '@/features/theme-switcher'

/** Створює theme store до першого рендера, щоб збережена тема застосувалась без "миготіння". */
export function setupTheme(): void {
  useThemeStore()
}
