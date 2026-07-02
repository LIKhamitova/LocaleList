# Milestone 3 — Handoff Note (Final)

## Что сделано

Milestone 3 перевёл UI на новый дизайн: тёмная тема, flag-icons CDN, 6 колонок, поиск.

### Изменённые файлы

| Файл | Что сделано |
|---|---|
| `src/index.html` | Новая структура: подключение flag-icons CDN, favicon, поле поиска, таблица на 6 колонок (Flag, Code, Language, Country, Currency, TLD) |
| `src/style.css` | Полная замена: тёмная тема через CSS-переменные (`--bg:#0f172a`, `--accent:#6366f1`), стили поиска, спиннер, адаптивность под 375px/768px, `@media print` |
| `src/app.js` | Новая логика: 6 колонок, флаги через `fi fi-XX`, live-поиск по коду/языку/стране, счётчик локалей |
| `HANDOFF_NOTE.md` | Этот файл — обновлён |

### Не изменилось

- `src/server/locales.json` — контракт API сохранён
- `src/server/server.js` — раздача статики не менялась
- `test/test-locales.js` — 170 тестов проходят

## Архитектура

- **Флаги**: `flag-icons` CDN — код страны извлекается из `code` (en-US → `fi fi-us`). Inline SVG в данных больше не используется для отображения, но остаётся в JSON для обратной совместимости.
- **Поиск**: клиентский, case-insensitive, фильтрует по `code`, `language`, `country`. Без серверной фильтрации.
- **Дизайн**: тёмная тема, системный шрифт, monospace для кодов, indigo accent.

## Как запустить

```bash
node src/server/server.js
# → http://localhost:3000
```

## Проверка

```bash
# 1) M1 совместимость
node test/test-locales.js   # → exit 0, 170 passed

# 2) Статика
curl http://localhost:3000/           # → HTML (dark theme)
curl http://localhost:3000/style.css  # → CSS с CSS-переменными
curl http://localhost:3000/app.js     # → JS

# 3) API
curl http://localhost:3000/locales    # → JSON, 15 записей

# 4) 404
curl http://localhost:3000/whatever   # → {"error":"Not found"}
```

## Визуальная проверка

1. Открыть `http://localhost:3000` — тёмная тема, спиннер, затем таблица
2. Ввести в поиск `ger` — должны остаться `de-DE` (Germany)
3. Ввести `English` — должны остаться en-US, en-GB, en-IN
4. Очистить поиск — все 15 строк
5. Уменьшить окно до 375px — таблица скроллится, не разваливается
6. Favicon (глобус) во вкладке браузера

## Scope notes

- Контракт `/locales` не изменён — обратная совместимость с M1
- Единственная внешняя зависимость — flag-icons CDN (css, без JS)
- Нет npm, нет фреймворков, нет сборщиков
- Поиск — клиентский, простой, без пагинации
