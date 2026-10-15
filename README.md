# vue-lottery-app

Лабораторна №4: застосунок-лотерея на Vue 3 (Composition API + TypeScript).

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # перевірка типів (vue-tsc) + збірка
npm run lint       # ESLint (Vue style guide)
npm run format     # Prettier
```

## Що реалізовано

- **Форма реєстрації**: усі поля обов'язкові; regexp для e-mail та телефону (`+380XXXXXXXXX`); `input type="date"` (yyyy-mm-dd), дата в майбутньому - помилка; після Save учасник додається в таблицю, форма очищується **без спрацювання валідації**; унікальність e-mail без урахування регістру; Enter відправляє форму (`@keydown.enter`).
- **Переможці**: випадковий вибір кнопкою «New winner»; не більше 3; кнопка неактивна, якщо переможців 3, учасників немає або всі вже стали переможцями; видалення переможця; видалення учасника прибирає його і з переможців.
- **Таблиця**: сортування за іменем та датою народження (повторний клік змінює напрямок), пошук за іменем з debounce 300 мс (`SearchBar` -> подія `filter-by-name`), спочатку фільтрація, потім сортування; редагування (модалка з формою та валідацією) і видалення (модалка підтвердження); Esc закриває модалку.
- **localStorage**: збереження через `watch(..., { deep: true })`, відновлення при завантаженні.

## Структура

```
src/
  components/   BaseButton, BaseInput, BaseModal, SearchBar, ParticipantForm,
                TheWinnersBlock(+Item), TheRegistrationBlock, TheParticipantsBlock
  composables/  useParticipants (стан + localStorage), useWinners
  utils/        validators, participants (filter/sort/format), storage, id
  types/        Participant, SortState, ...
  assets/styles/main.scss   вибірковий імпорт Bootstrap + власні стилі
```

Назви компонентів відповідають Vue style guide: `Base*` для базових, `The*` для унікальних, дочірній компонент має префікс батьківського (`TheWinnersBlockItem`).

## Висновки

_(за потреби додайте власні нотатки)_
