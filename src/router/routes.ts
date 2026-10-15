import type { RouteRecordRaw } from 'vue-router'

// Усі сторінки підключаються ліниво: () => import(...) - кожна потрапляє в окремий JS-чанк
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About author' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
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
        component: () => import('@/views/UsersView.vue'),
        meta: { title: 'Users' },
      },
      {
        // має стояти перед ':id', інакше "new" сприйметься як id
        path: 'new',
        name: 'user-create',
        component: () => import('@/views/UserCreateView.vue'),
        meta: { title: 'New user' },
      },
      {
        // (\\d+) - id може бути лише числом, інакше спрацює 404
        path: ':id(\\d+)',
        name: 'user-detail',
        component: () => import('@/views/UserDetailView.vue'),
        props: true,
        meta: { title: 'User' },
        children: [
          {
            // вкладений маршрут: /users/:id/edit, відображається у <RouterView> всередині UserDetailView
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/views/UserEditView.vue'),
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
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]
