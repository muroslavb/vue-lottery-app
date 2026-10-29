import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/** Підключення Pinia + плагін збереження стану (store з опцією persist пишуть у localStorage). */
export function setupPinia() {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  return pinia
}
