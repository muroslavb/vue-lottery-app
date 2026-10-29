import { createPinia } from 'pinia'

/** Підключення Pinia (стани застосунку живуть у store-ах шарів entities / features). */
export function setupPinia() {
  return createPinia()
}
