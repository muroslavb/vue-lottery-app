// Єдине місце (разом із shared/ui), де підключається UI-бібліотека PrimeVue.
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import type { App } from 'vue'

// Тема: Aura з основним кольором застосунку (#3bafda)
const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#effafd',
      100: '#d4f1fa',
      200: '#a9e3f4',
      300: '#7ed3ed',
      400: '#56c1e4',
      500: '#3bafda',
      600: '#2d8fb8',
      700: '#256f8f',
      800: '#1d5069',
      900: '#163a4c',
      950: '#0c2330',
    },
  },
})

export function setupUi(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: AppPreset,
      // темна тема вмикається класом .app-dark на <html>
      options: { darkModeSelector: '.app-dark' },
    },
  })
  app.use(ToastService)
}
