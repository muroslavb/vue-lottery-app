import type { RouteRecordRaw } from 'vue-router'

// Усі сторінки підключаються ліниво: () => import(...) - кожна потрапляє в окремий JS-чанк
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home').then((module) => module.HomePage),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about').then((module) => module.AboutPage),
    meta: { title: 'About author' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login').then((module) => module.LoginPage),
    meta: { title: 'Login', layout: 'auth', guestOnly: true },
  },
  {
    // батьківський маршрут без компонента: лише спільний префікс і спільний meta для всіх дочірніх
    path: '/users',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/pages/users').then((module) => module.UsersPage),
        meta: { title: 'Users' },
      },
      {
        // має стояти перед ':id', інакше "new" сприйметься як id
        path: 'new',
        name: 'user-create',
        component: () => import('@/pages/user-create').then((module) => module.UserCreatePage),
        meta: { title: 'New user' },
      },
      {
        // (\\d+) - id може бути лише числом, інакше спрацює 404
        path: ':id(\\d+)',
        name: 'user-detail',
        component: () => import('@/pages/user-details').then((module) => module.UserDetailsPage),
        props: true,
        meta: { title: 'User' },
        children: [
          {
            // вкладений маршрут: /users/:id/edit, відображається у <RouterView> всередині UserDetailView
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/pages/user-details').then((module) => module.UserEditPage),
            props: true,
            meta: { title: 'Edit user' },
          },
        ],
      },
    ],
  },
  {
    // catch-all: будь-який невідомий шлях
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found').then((module) => module.NotFoundPage),
    meta: { title: 'Page not found' },
  },
]
