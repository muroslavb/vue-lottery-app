export const PROJECT_GITHUB_URL = 'https://github.com/muroslavb/vue-lottery-app.git'

export const AUTHOR = {
  fullName: 'Бельмега М. І.',
  githubUrl: 'https://github.com/muroslavb',
  university: 'Чернівецький національний університет імені Юрія Федьковича',
  department: 'Кафедра програмного забезпечення комп’ютерних систем',
  skills: [
    'Vue.js 3',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Java',
    'HTML / CSS / SCSS',
    'Bootstrap',
    'Jest',
    'Git / GitHub',
  ],
} as const

export const TECHNOLOGIES = [
  { name: 'Vue 3 (Composition API, <script setup>)', note: 'інтерфейс і компоненти' },
  { name: 'TypeScript', note: 'типізація props, emits, сервісів і сторів' },
  { name: 'Vue Router 4', note: 'маршрути, guards, meta, ліниве завантаження' },
  { name: 'Pinia', note: 'стан авторизації та списку користувачів' },
  { name: 'Repository pattern', note: 'UserService, AuthService, ServiceProvider' },
  { name: 'VeeValidate + Yup', note: 'валідація форм' },
  { name: 'Bootstrap 5 + SCSS', note: 'стилі (імпортуються вибірково)' },
  { name: 'Vite, ESLint, Prettier', note: 'збірка та якість коду' },
  { name: 'DummyJSON', note: 'тестовий REST API (Users, Auth/JWT)' },
] as const
