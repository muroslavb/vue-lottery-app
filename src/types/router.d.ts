import 'vue-router'

declare module 'vue-router' {
  // типізація поля meta у маршрутах
  interface RouteMeta {
    /** Сторінка доступна лише авторизованим користувачам. */
    requiresAuth?: boolean
    /** Сторінка лише для гостей (авторизованого перенаправляємо на /users). */
    guestOnly?: boolean
    /** Заголовок вкладки браузера. */
    title?: string
    /** Layout, у який обгортається сторінка. */
    layout?: 'default' | 'auth'
  }
}
