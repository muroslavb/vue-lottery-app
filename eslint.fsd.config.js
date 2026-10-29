// Правила Feature-Sliced Design для ESLint (eslint-plugin-boundaries).
//  - npm run lint:fsd  - лише перевірка архітектури (цей файл як конфіг);
//  - npm run lint      - основний eslint.config.js підключає ті самі правила (fsdRules).
import boundaries from 'eslint-plugin-boundaries'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

// шари від найвищого до найнижчого: модуль може імпортувати лише з шарів нижче за себе
const LOWER_LAYERS = {
  app: ['pages', 'widgets', 'features', 'entities', 'shared'],
  pages: ['widgets', 'features', 'entities', 'shared'],
  widgets: ['features', 'entities', 'shared'],
  features: ['entities', 'shared'],
  entities: ['shared'],
  // сегменти shared (api, ui, lib, config) можуть імпортувати один одного
  shared: ['shared'],
}

export const fsdRules = [
  {
    files: ['src/**/*.{ts,vue}'],
    plugins: { boundaries },
    settings: {
      // щоб плагін розумів alias @ -> src
      'import/resolver': { typescript: { alwaysTryTypes: true, project: './tsconfig.json' } },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', mode: 'folder' },
        { type: 'pages', pattern: 'src/pages/*', mode: 'folder' },
        { type: 'widgets', pattern: 'src/widgets/*', mode: 'folder' },
        { type: 'features', pattern: 'src/features/*', mode: 'folder' },
        { type: 'entities', pattern: 'src/entities/*', mode: 'folder' },
        { type: 'shared', pattern: 'src/shared/*', mode: 'folder' },
      ],
    },
    rules: {
      // 1-2. напрямок залежностей: лише вниз; слайси одного шару не імпортують один одного
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: Object.entries(LOWER_LAYERS).map(([from, allow]) => ({ from, allow })),
        },
      ],
      // 3. Public API: з іншого слайса можна імпортувати лише його index.ts (без глибоких імпортів)
      'boundaries/entry-point': [
        'error',
        {
          default: 'disallow',
          rules: [
            { target: ['pages', 'widgets', 'features', 'entities', 'shared'], allow: 'index.ts' },
          ],
        },
      ],
    },
  },
  {
    // UI-бібліотеку (PrimeVue) дозволено імпортувати лише в shared/ui та app/providers/ui.ts
    files: ['src/**/*.{ts,vue}'],
    ignores: ['src/shared/ui/**', 'src/app/providers/ui.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['primevue', 'primevue/*', '@primeuix/*', 'primeicons', 'primeicons/*'],
              message: 'UI-бібліотеку можна імпортувати лише в shared/ui та app/providers/ui.ts.',
            },
          ],
        },
      ],
    },
  },
]

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  ...pluginVue.configs['flat/base'],
  { files: ['**/*.ts'], languageOptions: { parser: tseslint.parser } },
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  ...fsdRules,
]
