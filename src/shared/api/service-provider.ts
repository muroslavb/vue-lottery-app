type Factory<T> = () => T

/**
 * Універсальний реєстр сервісів. Не знає про конкретні сервіси (shared не залежить від entities):
 * їх реєструє шар app у providers/services.ts.
 */
export class ServiceProvider {
  private static factories = new Map<string, Factory<unknown>>()
  private static instances = new Map<string, unknown>()

  static register<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory)
    // нова реєстрація скидає вже створений екземпляр (корисно для тестів і заміни сервісу)
    this.instances.delete(key)
  }

  static get<T>(key: string): T {
    if (!this.instances.has(key)) {
      const factory = this.factories.get(key)
      if (!factory) {
        throw new Error(`Service "${key}" is not registered`)
      }
      this.instances.set(key, factory())
    }
    return this.instances.get(key) as T
  }
}
