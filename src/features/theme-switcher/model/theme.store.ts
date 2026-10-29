import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

const DARK_CLASS = 'app-dark'

/**
 * Store налаштувань теми (setup store). Збереження у localStorage робить плагін
 * pinia-plugin-persistedstate (опція persist) - на відміну від ручної реалізації
 * у entities/session/model/session.store.ts.
 */
export const useThemeStore = defineStore(
  'theme',
  () => {
    const mode = ref<ThemeMode>('light')
    const isDark = computed(() => mode.value === 'dark')

    function toggle(): void {
      mode.value = isDark.value ? 'light' : 'dark'
    }

    // клас на <html> вмикає темну тему PrimeVue (darkModeSelector у app/providers/ui.ts);
    // flush: 'sync' - тема застосовується одразу після відновлення збереженого значення
    watch(
      isDark,
      (dark) => {
        document.documentElement.classList.toggle(DARK_CLASS, dark)
      },
      { immediate: true, flush: 'sync' },
    )

    return { mode, isDark, toggle }
  },
  { persist: { key: 'vue-lottery-theme', pick: ['mode'] } },
)
