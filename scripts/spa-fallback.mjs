// GitHub Pages не вміє віддавати index.html для "глибоких" адрес (/users/1).
// Копія index.html у 404.html змушує Pages завантажити застосунок, і vue-router сам розбере шлях.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('dist/404.html created (SPA fallback for gh-pages)')
