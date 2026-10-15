# vue-lottery-app

Лабораторна №4-5: застосунок на Vue 3 (Composition API + TypeScript).
Гілка `feature/routing` (ЛР5): vue-router, патерн Repository, авторизація JWT, Pinia, VeeValidate.

## Запуск

```bash
npm install
cp .env.example .env   # адреса API (VITE_API_URL)
npm run dev            # http://localhost:5173
npm run build          # перевірка типів (vue-tsc) + збірка + 404.html для gh-pages
npm run lint           # ESLint (Vue style guide)
npm run format         # Prettier
npm run deploy         # збірка і публікація dist у гілку gh-pages
```

Тестовий акаунт для входу: `emilys` / `emilyspass` ([DummyJSON](https://dummyjson.com/docs)).

## Що реалізовано (ЛР5)

- **vue-router**: `AppHeader`, `AppNavigation` (Home, About author, Users, Login / Logout), `AppLogo`, підсвічування активного пункту, сторінки Home і About, 404 (`/:pathMatch(.*)*`), ліниве завантаження сторінок `() => import(...)`.
- **Repository**: інтерфейси `Readable`, `Pageable`, `Creatable`, `Editable`, `Deletable`; `UserService`, `AuthService`; фабрика `ServiceProvider`; HTTP-клієнт `api/http-client.ts` з адресою з `VITE_API_URL`.
- **Users**: таблиця з DummyJSON, пагінація (`limit`/`skip`) і пошук, `page` та `q` зберігаються в URL (`/users?page=2&q=john`); `/users/:id` (`props: true`), вкладений `/users/:id/edit`, створення `/users/new`; після POST/PUT/DELETE локальний стан оновлюється (DummyJSON дані не змінює).
- **Авторизація**: `POST /auth/login`, токени й користувач у Pinia та `localStorage`, `GET /auth/me` із `Authorization: Bearer`, Logout; guard `meta.requiresAuth` + `redirect`, гостьові сторінки (`meta.guestOnly`).
- **Інше**: loading / error стани, VeeValidate + Yup, `meta.title` + `router.afterEach`, автоматичний refresh токена при 401 (interceptor), Layouts через `meta.layout` (`DefaultLayout`, `AuthLayout`).

## Структура

```
src/
  api/          http-client.ts (fetch, Bearer, interceptor 401 -> refresh)
  services/     interfaces, user.service, auth.service, service-provider
  stores/       auth (Pinia), users (Pinia)
  router/       routes, guards, index
  layouts/      DefaultLayout, AuthLayout
  views/        Home, About, Login, Users, UserDetail, UserEdit, UserCreate, NotFound
  components/   AppHeader, AppNavigation, AppLogo, Base*, SearchBar, BasePagination,
                UserForm, UserDeleteModal
  schemas/      Yup-схеми (user, login)
  types/        User, Auth, RouteMeta
  utils/        errors, auth-storage, users
```

## Деплой на gh-pages

1. `git checkout -b feature/routing`
2. Підставте свої дані в `src/data/about.ts` (ПІБ, GitHub).
3. `npm run deploy`, потім у GitHub: Settings → Pages → Branch `gh-pages`.

## Висновки

_(додайте власні нотатки)_
