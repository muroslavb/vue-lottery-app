/** Кількість користувачів на одній сторінці таблиці (параметр limit). */
export const PAGE_SIZE = 10

/** Затримка (мс) перед тим, як SearchBar передасть новий пошуковий запит. */
export const SEARCH_DEBOUNCE_MS = 300

/** Ключ localStorage, під яким зберігається сесія (токени + користувач). */
export const AUTH_STORAGE_KEY = 'vue-lottery-auth'

/** Ключ localStorage для локального збереження учасників (якщо потрібно). */
export const PARTICIPANTS_STORAGE_KEY = 'vue-lottery-participants'

/** Максимальна кількість переможців у лотереї. */
export const MAX_WINNERS = 3

/** Термін життя accessToken у хвилинах (параметр expiresInMins у DummyJSON). */
export const ACCESS_TOKEN_TTL_MINUTES = 30

/** Суфікс заголовка вкладки браузера. */
export const APP_TITLE = 'Vue Lottery'
