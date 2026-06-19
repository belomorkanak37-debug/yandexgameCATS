# Котокафе: Match & Serve

Уютная mobile-first HTML5 игра для Яндекс Игр: link-match поле 6x6, котики-клиенты, заказы, таймер смены, монеты, улучшения, сохранение прогресса и fallback для Yandex Games SDK.

## Live preview

После успешного GitHub Actions деплоя игра будет доступна здесь:

https://belomorkanak37-debug.github.io/yandexgameCATS/

Если страница ещё не открывается, проверь вкладку **Actions** в GitHub: workflow `Deploy live preview` должен завершиться зелёной галочкой. В настройках репозитория GitHub Pages должен использовать Source: **GitHub Actions**.

## Запуск локально

```bash
npm install
npm run dev
npm run build
```

Сборка попадает в `dist`.

## Структура

- `src/main.ts` — текущий рабочий playable MVP.
- `src/game/types.ts` — доменные типы игры.
- `src/game/board.ts` — модель link-match поля 6x6.
- `src/game/orders.ts` и `src/game/customers.ts` — заказы и котики.
- `src/game/balance.ts` — очки, комбо, цены улучшений.
- `src/game/levels.ts` — прогрессия дней.
- `src/game/storage.ts` — localStorage save.
- `src/game/yandex.ts`, `ads.ts`, `leaderboard.ts` — SDK, реклама, leaderboard fallback.

## Что дальше

Следующий шаг — перенести главный цикл из `src/main.ts` в `src/game/Game.ts`, добавить `renderer.ts` и Canvas 2.5D rendering modules.
