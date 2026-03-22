# 📋 План разработки Rack Calculator V2

> **Статус:** Sprint 3.5 (Frontend Foundation) — ✅ Завершён
> **Последнее обновление:** 22 марта 2026 г.
> **Git:** `feature/sprint3.5-frontend-foundation`

---

## 🎯 Стратегия разработки

### Принцип построения

1. **Сначала backend (ядро)** — аутентификация, пользователи, права
2. **Затем frontend (интерфейс)** — UI для работы с готовым API
3. **Параллельная разработка** — бизнес-модули (Rack, Battery, Export)

**Почему так:**

- Backend — это «ядро» системы, все функции будут использоваться и фронтендом, и будущими модулями
- Фронтенд строится поверх стабильного ядра и легко интегрируется
- Каждый новый модуль сразу использует ядро auth/RBAC/audit

---

## 🎨 Дизайн-система и инфраструктура UI

> **Приоритет:** 🔴 Высокий | **Статус:** ✅ **ЗАВЕРШЕНА**

Перед разработкой бизнес-функций создаётся фундамент UI: дизайн-система, компоненты, layout.

### Стек и инструменты

| Решение           | Описание                                                     | Статус |
| ----------------- | ------------------------------------------------------------ | ------ |
| **UI-библиотека** | **shadcn/ui** — копируемые компоненты на Radix UI + Tailwind | ✅     |
| **Стили**         | Tailwind CSS v4                                              | ✅     |
| **Стиль**         | Современный минимализм (Linear, Vercel)                      | ✅     |
| **Темы**          | Светлая + тёмная (auto-switch)                               | ✅     |
| **Цвета**         | Акцент: тёмно-синий (`slate-900` / `blue-700`)               | ✅     |
| **Storybook**     | Документация компонентов                                     | ✅     |
| **Адаптивность**  | Fully responsive (mobile-first)                              | ✅     |

### Установленные компоненты

- **Базовые:** Button, Input, Label, Select, Checkbox, RadioGroup
- **Контейнеры:** Card, Table, Dialog, DropdownMenu
- **Обратная связь:** Sonner (toast), Skeleton, Spinner, Badge
- **Прочие:** Avatar, ScrollArea, Separator

### Созданные layout-компоненты

- **Header** — логотип, навигация, темы, уведомления, профиль
- **Sidebar** — боковое меню с разделами (Dashboard, Стеллажи, Настройки, Админка)
- **AppLayout** — адаптивный layout с mobile sidebar

### Структура UI-компонентов

```
client/src/
├── components/
│   ├── ui/              # Базовые компоненты (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx   # Модальные окна
│   │   ├── toast.tsx    # Уведомления
│   │   ├── skeleton.tsx
│   │   ├── spinner.tsx
│   │   └── ...
│   ├── layout/          # Layout-компоненты
│   │   ├── AppLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── NavMenu.tsx
│   └── shared/          # Общие компоненты проекта
│       ├── PageHeader.tsx
│       ├── DataTable.tsx
│       └── ...
```

### Layout и навигация

**Тип:** Комбинированная навигация (Header + Sidebar)

```
┌─────────────────────────────────────────────┐
│                 Header                      │
│  [Logo]  [Меню]              [Profile] [🌙] │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │         Main Content             │
│          │                                  │
│ • Dashboard                              │
│ • Стеллажи ▼                           │
│   └─ Калькулятор                         │
│   └─ Подбор батареи                      │
│ • Настройки                              │
│ • Админка                                │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### Структура приложения

| Раздел        | Маршрут      | Описание                          |
| ------------- | ------------ | --------------------------------- |
| **Dashboard** | `/dashboard` | Главная после входа, сводка       |
| **Профиль**   | `/profile`   | Настройки пользователя            |
| **Стеллажи**  | `/rack/*`    | Калькулятор + подбор батарей      |
| **Настройки** | `/settings`  | Общие настройки системы           |
| **Админка**   | `/admin/*`   | Управление пользователями, ролями |

### Auth flow

| Сценарий                               | Реализация                 |
| -------------------------------------- | -------------------------- |
| Не авторизован → доступ к защищённому  | Redirect на `/login`       |
| Авторизован → `/login` или `/register` | Redirect на `/dashboard`   |
| Protected routes                       | Обёртка `<ProtectedRoute>` |
| Guest routes                           | Обёртка `<GuestRoute>`     |

### ESLint/Prettier

- `eslint-plugin-tailwindcss` — линтинг классов Tailwind
- `prettier-plugin-tailwindcss` — сортировка классов
- `tailwind.config.js` — кастомная тема (цвета, шрифты)

---

## 📅 Дорожная карта спринтов

### Sprint 0 — Подготовка проекта ✅

**Статус:** ✅ **ЗАВЕРШЁН**

| Компонент    | Задачи                                                             | Статус |
| ------------ | ------------------------------------------------------------------ | ------ |
| **Backend**  | Node.js + TypeScript + Express, Prisma (MongoDB), Zod, JWT, Vitest | ✅     |
| **Frontend** | React + TypeScript + Vite, структура папок                         | ✅     |
| **DevOps**   | Monorepo (workspaces), concurrently, ESLint, Prettier              | ✅     |

**Результат:** готовый skeleton проекта для разработки

---

### Sprint 1 — User Management & Auth ✅

**Статус:** ✅ **ЗАВЕРШЁН** (в `main`)

| Компонент    | Задачи                                                                 | Статус |
| ------------ | ---------------------------------------------------------------------- | ------ |
| **Backend**  | Users module, Auth module, JWT Service, Auth Middleware, Prisma schema | ✅     |
| **Frontend** | —                                                                      | ⏳     |

**API Endpoints:**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/reset-password/request`
- `POST /api/auth/reset-password/confirm`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Результат:** пользователи могут регистрироваться, логиниться, сбрасывать пароль, JWT работает

**Технический долг:**

- ⚠️ Unit-тесты: не созданы
- ⚠️ Email verification: use-case есть, отправка не реализована

---

### Sprint 2 — Frontend Auth Pages ✅

**Статус:** ✅ **ЗАВЕРШЁН** (в `main`)

| Компонент    | Задачи                                                                                      | Статус           |
| ------------ | ------------------------------------------------------------------------------------------- | ---------------- |
| **Backend**  | —                                                                                           | ✅ (из Sprint 1) |
| **Frontend** | API client, Auth service, Zustand store, Формы (Zod + RHF), Страницы login/register/profile | ✅               |

**Страницы:**

- `/login` — вход
- `/register` — регистрация
- `/profile` — профиль пользователя

**Результат:** полный цикл аутентификации работает (frontend + backend)

---

### Sprint 3 — Roles & RBAC ✅

**Статус:** ✅ **ЗАВЕРШЁН** (в `feature/sprint3-rbac`)

| Компонент    | Задачи                                                           | Статус |
| ------------ | ---------------------------------------------------------------- | ------ |
| **Backend**  | Roles module, Permissions module, PolicyService, RBAC Middleware | ✅     |
| **Frontend** | —                                                                | ⏳     |

**API Endpoints:**

- `GET/POST /api/roles`
- `GET/PUT/DELETE /api/roles/:id`
- `POST/DELETE /api/roles/:id/permissions`
- `GET/POST /api/permissions`
- `GET/PUT/DELETE /api/permissions/:id`
- `GET /api/permissions/resource/:resource`

**Middleware:**

- `requirePermission(resource, action)`
- `requireAnyPermission([...])`
- `requireRole(roleName)`

**Результат:** система ролей и прав доступа готова к использованию

---

### Sprint 3.5 — Frontend Foundation: Дизайн-система и структура ✅

**Статус:** ✅ **ЗАВЕРШЁН** | **Приоритет:** 🔴 Высокий

| Компонент          | Задачи                                                                                               | Статус |
| ------------------ | ---------------------------------------------------------------------------------------------------- | ------ |
| **Инфраструктура** | Tailwind CSS v4, shadcn/ui, Storybook, ESLint/Prettier правила                                       | ✅     |
| **UI-компоненты**  | Button, Input, Select, Checkbox, Radio, Card, Table, Dialog, DropdownMenu, Sonner, Skeleton, Spinner | ✅     |
| **Layout**         | AppLayout, Header, Sidebar, NavMenu                                                                  | ✅     |
| **Роутинг**        | ProtectedRoute, GuestRoute, структура маршрутов                                                      | ✅     |
| **Страницы**       | Dashboard, LoginPage, RegisterPage (обновлены)                                                       | ✅     |

**Результат:** готова дизайн-система, layout, навигация, базовые компоненты для разработки бизнес-функций

---

### Sprint 4 — Audit / Logging ⏳

**Статус:** ⏳ **НЕ НАЧАТ**

| Компонент    | Задачи                                                                                                        | Приоритет  |
| ------------ | ------------------------------------------------------------------------------------------------------------- | ---------- |
| **Backend**  | Audit module (AuditEvent entity, AuditRepository), Use-case: `logAction`, Middleware для логирования действий | 🔴 Высокий |
| **Frontend** | UI для просмотра логов (админ-панель)                                                                         | 🟡 Средний |

**Результат:** все критичные действия пользователей и системы логируются

---

### Sprint 5 — Core Business Module: Rack ⚠️

**Статус:** ⚠️ **ЧАСТИЧНО НАЧАТ** (создана структура модуля)

| Компонент    | Задачи                                                                                                                                                                                                                | Приоритет  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Backend**  | Domain: `calculateRack()` (алгоритм из `RACK_ALGORITHM_BUSINESS.md`), Value Objects (Size, Rows, Weight), RackEntity, RackRepository, Use-case: `calculateRackUseCase`, RackController, Routes: `/api/rack/calculate` | 🔴 Высокий |
| **Frontend** | Страница калькулятора стеллажей, Форма ввода параметров, Отображение результатов, Сохранение конфигураций (RackSet)                                                                                                   | 🔴 Высокий |

**Алгоритм расчёта включает:**

- Расчёт опор (крайние + промежуточные)
- Расчёт балок (по типам пролётов)
- Расчёт вертикальных стоек (для 2+ этажей)
- Расчёт распорок (для 2+ этажей)
- Расчёт изоляторов (для 1 этажа)
- Генерация названия стеллажа
- Расчёт стоимости (базовая, без изоляторов, нулевая)

**Результат:** первый бизнес-инструмент готов и защищён ядром приложения

---

### Sprint 6 — Battery Module ⏳

**Статус:** ⏳ **НЕ НАЧАТ**

| Компонент    | Задачи                                                                                                                                                      | Приоритет  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Backend**  | Domain: `calculateBatteryFit()`, BatteryEntity, BatteryRepository, Use-case: `calculateBatteryUseCase`, BatteryController, Routes: `/api/battery/calculate` | 🟡 Средний |
| **Frontend** | Страница подбора батарей, Интеграция с Rack калькулятором, Отображение совместимости                                                                        | 🟡 Средний |

**Результат:** подбор батарей для стеллажей работает

---

### Sprint 7 — Export / Revisions / Soft Delete ⏳

**Статус:** ⏳ **НЕ НАЧАТ**

| Компонент    | Задачи                                                                                             | Приоритет  |
| ------------ | -------------------------------------------------------------------------------------------------- | ---------- |
| **Backend**  | Export: `exportRackSet` (Excel / PDF), Revisions: сохранение версий RackSet, Soft delete / restore | 🟡 Средний |
| **Frontend** | Страницы экспорта, Управление версиями, Восстановление удалённых элементов, Фильтры и пагинация    | 🟡 Средний |

**Результат:** пользователи могут сохранять комплекты, восстанавливать и экспортировать

---

### Sprint 8 — Завершение и деплой ⏳

**Статус:** ⏳ **НЕ НАЧАТ**

| Компонент  | Задачи                                                                               | Приоритет  |
| ---------- | ------------------------------------------------------------------------------------ | ---------- |
| **DevOps** | Docker + docker-compose, CI/CD (сборка, тесты, деплой), Окружения (dev/staging/prod) | 🔴 Высокий |
| **Docs**   | OpenAPI / Swagger документация                                                       | 🟡 Средний |
| **Tests**  | Unit-тесты (use-cases), Integration-тесты (API endpoints), E2E-тесты                 | 🔴 Высокий |

**Результат:** готовый проект к продакшену

---

## 📊 Сводная таблица статусов

| Спринт         | Название                                        | Backend | Frontend | Общий статус |
| -------------- | ----------------------------------------------- | ------- | -------- | ------------ |
| **Sprint 0**   | Подготовка проекта                              | ✅      | ✅       | ✅ Завершён  |
| **Sprint 1**   | User Management & Auth                          | ✅      | —        | ✅ Завершён  |
| **Sprint 2**   | Frontend Auth Pages                             | ✅      | ✅       | ✅ Завершён  |
| **Sprint 3**   | Roles & RBAC                                    | ✅      | —        | ✅ Завершён  |
| **Sprint 3.5** | Frontend Foundation: Дизайн-система и структура | —       | ✅       | ✅ Завершён  |
| **Sprint 4**   | Audit / Logging                                 | ⏳      | ⏳       | ⏳ Не начат  |
| **Sprint 5**   | Core Business Module: Rack                      | ⚠️      | ⏳       | ⚠️ Частично  |
| **Sprint 6**   | Battery Module                                  | ⏳      | ⏳       | ⏳ Не начат  |
| **Sprint 7**   | Export / Revisions / Soft Delete                | ⏳      | ⏳       | ⏳ Не начат  |
| **Sprint 8**   | Завершение и деплой                             | ⏳      | ⏳       | ⏳ Не начат  |

---

## 📈 Прогресс проекта

```
Backend:  ████████████░░░░░░░░░░ 40%
Frontend: █████████░░░░░░░░░░░░░ 25%
Tests:    ░░░░░░░░░░░░░░░░░░░░░░  0%
Docs:     ██████████████████████ 100%
```

---

## ⚠️ Технические долги

| Проблема               | Приоритет  | Описание                                     |
| ---------------------- | ---------- | -------------------------------------------- |
| **Отсутствие тестов**  | 🔴 Высокий | Unit и integration тесты не созданы          |
| **Email verification** | 🟡 Средний | Use-case есть, отправка email не реализована |
| **Audit logging**      | 🟡 Средний | Логирование действий не реализовано          |
| **Rack domain logic**  | 🟡 Средний | Структура есть, алгоритм не реализован       |

---

## 🚀 Следующие шаги (приоритеты)

1. **Sprint 5 (Rack Backend)** — реализовать domain-логику расчёта стеллажей:
   - Domain: `calculateRack()` по алгоритму из `RACK_ALGORITHM_BUSINESS.md`
   - Value Objects: Size, Rows, Weight
   - RackEntity, RackRepository
   - Use-case: `calculateRackUseCase`
   - RackController + Routes: `/api/rack/calculate`

2. **Sprint 5 (Rack Frontend)** — создать интерфейс калькулятора стеллажей:
   - Страница `/rack/calculator`
   - Форма ввода параметров
   - Отображение результатов
   - Сохранение конфигураций (RackSet)

3. **Sprint 4 (Audit)** — добавить логирование действий пользователей

4. **Тесты** — покрыть unit-тестами use-cases (auth, rbac, rack)

---

## 📁 Структура проекта

```
rack-calculator-v2/
├── client/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # UI компоненты
│   │   ├── hooks/             # Кастомные хуки
│   │   ├── pages/             # Страницы (Login, Register, Profile, Rack, Battery...)
│   │   ├── services/          # API client, auth service, rack service...
│   │   ├── stores/            # Zustand stores (auth, rack...)
│   │   ├── types/             # TypeScript типы
│   │   └── utils/             # Утилиты, validation
│   └── package.json
│
├── server/                     # Node.js + Express + Prisma
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Аутентификация ✅
│   │   │   ├── users/         # Пользователи ✅
│   │   │   ├── roles/         # Роли и права ✅
│   │   │   ├── permissions/   # Разрешения ✅
│   │   │   ├── rack/          # Расчёт стеллажей ⚠️
│   │   │   ├── battery/       # Подбор батарей 🔴
│   │   │   ├── audit/         # Логирование 🔴
│   │   │   └── common/        # Общие утилиты
│   │   ├── config/            # Конфигурация (ENV, DB, JWT)
│   │   ├── db/                # DB подключения (prisma.client.ts)
│   │   ├── routes.ts          # Маршруты
│   │   └── server.ts          # Точка входа
│   └── package.json
│
├── price/                      # База цен
└── документация
```

---

## 🛠️ Технологический стек

### Backend

| Технология           | Назначение            |
| -------------------- | --------------------- |
| Node.js + TypeScript | Платформа + типизация |
| Express 5.x          | Web-фреймворк         |
| Prisma 5.x (MongoDB) | ORM + база данных     |
| Zod                  | Валидация данных      |
| JWT (jsonwebtoken)   | Токены аутентификации |
| Vitest               | Тестирование          |
| tsx                  | ES modules            |

### Frontend

| Технология      | Назначение         |
| --------------- | ------------------ |
| React 19        | UI-библиотека      |
| TypeScript      | Типизация          |
| Vite            | Сборщик            |
| TanStack Query  | Работа с сервером  |
| Zustand         | State management   |
| React Hook Form | Управление формами |
| Zod             | Валидация форм     |
| Axios           | HTTP-клиент        |
| React Router    | Маршрутизация      |

### DevOps

| Технология              | Назначение          |
| ----------------------- | ------------------- |
| Docker + docker-compose | Контейнеризация     |
| concurrently            | Параллельный запуск |
| npm workspaces          | Monorepo            |

---

## 🔗 Ссылки на документацию

- [STATUS.md](./STATUS.md) — статус проекта
- [RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md) — алгоритм расчёта стеллажей
- [summory.md](./summory.md) — техническое резюме проекта
- [backend-sturcure.md](./backend-sturcure.md) — структура бэкенда
