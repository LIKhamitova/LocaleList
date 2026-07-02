# Milestone 1 — Backend API + Test

## Структура файлов

```
src/
  server/
    locales.json    — 15 локалей с полями
    server.js       — HTTP-сервер, порт 3000
test/
  test-locales.js   — юнит-тест endpoint'a
```

## Поля каждой локали (locales.json)

| Поле | Тип | Пример |
|---|---|---|
| `code` | string | `en-AU` |
| `language` | string | `English` |
| `country` | string | `Australia` |
| `currency` | object | `{ code: "AUD", symbol: "$" }` |
| `tld` | string | `.au` |
| `flag` | string | `<svg>...</svg>` (inline) |
| `timezone` | string | `Australia/Sydney` |
| `capital` | string | `Canberra` |

## Сервер (server.js)

- Модуль `http`, никаких npm-зависимостей
- GET `/locales` → читает `locales.json` → отдаёт с `Content-Type: application/json`
- CORS: `Access-Control-Allow-Origin: *`
- Fallback: любой другой путь → 404 `{"error": "Not found"}`
- Порт из `process.env.PORT || 3000`

## Тест (test-locales.js)

- Запускает сервер на рандомном свободном порту
- Делает GET `/locales`
- Проверяет: статус 200, Content-Type JSON
- Проверяет: тело — массив из ровно 15 объектов
- Проверяет: у каждого объекта есть все обязательные поля
- Гасит сервер
- Exit code 0 при успехе, 1 при ошибке (все ошибки пишутся в stderr)

## Критерий остановки

```bash
# 1) Сервер стартует
node src/server/server.js   →  Server listening on port 3000

# 2) curl даёт валидный JSON с 15 записями
curl http://localhost:3000/locales   →  [{...}, ...]  (15 elements)

# 3) Тест проходит
node test/test-locales.js   →  exit 0, в stdout "✓ All tests passed"
```
