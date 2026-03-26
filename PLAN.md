# 📋 План розробки Rack Calculator V2

> **Статус:** Sprint 5 (Rack Module) — 🔴 НЕ РОЗПОЧАТО
> **Останнє оновлення:** 23 березня 2026 р.
> **Git:** `main` (актуальна)

---

## 🎯 Стратегія розробки

### Принцип побудови

1. **Спочатку backend (ядро)** — автентифікація, користувачі, права
2. **Потім frontend (інтерфейс)** — UI для роботи з готовим API
3. **Паралельна розробка** — бізнес-модулі (Rack, Battery, Export)

**Чому так:**

- Backend — це «ядро» системи, всі функції будуть використовуватися і фронтендом, і майбутніми модулями
- Фронтенд будується поверх стабільного ядра і легко інтегрується
- Кожен новий модуль одразу використовує ядро auth/RBAC/audit

---

## 🎨 Дизайн-система та інфраструктура UI

> **Пріоритет:** 🔴 Високий | **Статус:** ✅ **ЗАВЕРШЕНА**

Перед розробкою бізнес-функцій створюється фундамент UI: дизайн-система, компоненти, layout.

### Стек та інструменти

| Рішення           | Опис                                                             | Статус |
| ----------------- | ---------------------------------------------------------------- | ------ |
| **UI-бібліотека** | **shadcn/ui** — компоненти, що копіюються на Radix UI + Tailwind | ✅     |
| **Стилі**         | Tailwind CSS v4                                                  | ✅     |
| **Стиль**         | Сучасний мінімалізм (Linear, Vercel)                             | ✅     |
| **Теми**          | Світла + темна (auto-switch)                                     | ✅     |
| **Кольори**       | Акцент: темно-синій (`slate-900` / `blue-700`)                   | ✅     |
| **Storybook**     | Документація компонентів                                         | ✅     |
| **Адаптивність**  | Fully responsive (mobile-first)                                  | ✅     |

### Встановлені компоненти

- **Базові:** Button, Input, Label, Select, Checkbox, RadioGroup
- **Контейнери:** Card, Table, Dialog, DropdownMenu
- **Зворотний зв'язок:** Sonner (toast), Skeleton, Spinner, Badge
- **Інші:** Avatar, ScrollArea, Separator

### Створені layout-компоненти

- **Header** — логотип, навігація, теми, повідомлення, профіль
- **Sidebar** — бічне меню з розділами (Dashboard, Стелажі, Налаштування, Адмінка)
- **AppLayout** — адаптивний layout з mobile sidebar

### Структура UI-компонентів

```
client/src/
├── components/
│   ├── ui/              # Базові компоненти (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx   # Модальні вікна
│   │   ├── toast.tsx    # Повідомлення
│   │   ├── skeleton.tsx
│   │   ├── spinner.tsx
│   │   └── ...
│   ├── layout/          # Layout-компоненти
│   │   ├── AppLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── NavMenu.tsx
│   └── shared/          # Спільні компоненти проєкту
│       ├── PageHeader.tsx
│       ├── DataTable.tsx
│       └── ...
```

### Layout і навігація

**Тип:** Комбінована навігація (Header + Sidebar)

```
┌─────────────────────────────────────────────┐
│                 Header                      │
│  [Logo]  [Меню]              [Profile] [🌙] │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │         Main Content             │
│          │                                  │
│ • Dashboard                              │
│ • Стелажі ▼                           │
│   └─ Калькулятор                         │
│   └─ Підбір батареї                      │
│ • Налаштування                              │
│ • Адмінка                                │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### Структура додатку

| Розділ           | Маршрут      | Опис                             |
| ---------------- | ------------ | -------------------------------- |
| **Dashboard**    | `/dashboard` | Головна після входу, зведення    |
| **Профіль**      | `/profile`   | Налаштування користувача         |
| **Стелажі**      | `/rack/*`    | Калькулятор + підбір батарей     |
| **Налаштування** | `/settings`  | Загальні налаштування системи    |
| **Адмінка**      | `/admin/*`   | Управління користувачами, ролями |

### Auth flow

| Сценарій                                 | Реалізація                  |
| ---------------------------------------- | --------------------------- |
| Не авторизований → доступ до захищеного  | Redirect на `/login`        |
| Авторизований → `/login` або `/register` | Redirect на `/dashboard`    |
| Protected routes                         | Обгортка `<ProtectedRoute>` |
| Guest routes                             | Обгортка `<GuestRoute>`     |

### ESLint/Prettier

- `eslint-plugin-tailwindcss` — лінтинг класів Tailwind
- `prettier-plugin-tailwindcss` — сортування класів
- `tailwind.config.js` — кастомна тема (кольори, шрифти)

---

## 📅 Дорожня карта спринтів

### Sprint 0 — Підготовка проєкту ✅

**Статус:** ✅ **ЗАВЕРШЕНО**

| Компонент    | Завдання                                                           | Статус |
| ------------ | ------------------------------------------------------------------ | ------ |
| **Backend**  | Node.js + TypeScript + Express, Prisma (MongoDB), Zod, JWT, Vitest | ✅     |
| **Frontend** | React + TypeScript + Vite, структура папок                         | ✅     |
| **DevOps**   | Monorepo (workspaces), concurrently, ESLint, Prettier              | ✅     |

**Результат:** готовий skeleton проєкту для розробки

---

### Sprint 1 — User Management & Auth ✅

**Статус:** ✅ **ЗАВЕРШЕНО** (в `main`)

| Компонент    | Завдання                                                               | Статус |
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

**Результат:** користувачі можуть реєструватися, входити, скидати пароль, JWT працює

**Технічний борг:**

- ⚠️ Unit-тести: не створені
- ⚠️ Email verification: use-case є, відправка не реалізована

---

### Sprint 2 — Frontend Auth Pages ✅

**Статус:** ✅ **ЗАВЕРШЕНО** (в `main`)

| Компонент    | Завдання                                                                                    | Статус           |
| ------------ | ------------------------------------------------------------------------------------------- | ---------------- |
| **Backend**  | —                                                                                           | ✅ (із Sprint 1) |
| **Frontend** | API client, Auth service, Zustand store, Форми (Zod + RHF), Сторінки login/register/profile | ✅               |

**Сторінки:**

- `/login` — вхід
- `/register` — реєстрація
- `/profile` — профіль користувача

**Результат:** повний цикл автентифікації працює (frontend + backend)

---

### Sprint 3 — Roles & RBAC ✅

**Статус:** ✅ **ЗАВЕРШЕНО** (в `feature/sprint3-rbac`)

| Компонент    | Завдання                                                         | Статус |
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

**Результат:** система ролей і прав доступу готова до використання

---

### Sprint 3.5 — Frontend Foundation: Дизайн-система і структура ✅

**Статус:** ✅ **ЗАВЕРШЕНО** | **Пріоритет:** 🔴 Високий

| Компонент          | Завдання                                                                                             | Статус |
| ------------------ | ---------------------------------------------------------------------------------------------------- | ------ |
| **Інфраструктура** | Tailwind CSS v4, shadcn/ui, Storybook, ESLint/Prettier правила                                       | ✅     |
| **UI-компоненти**  | Button, Input, Select, Checkbox, Radio, Card, Table, Dialog, DropdownMenu, Sonner, Skeleton, Spinner | ✅     |
| **Layout**         | AppLayout, Header, Sidebar, NavMenu                                                                  | ✅     |
| **Роутинг**        | ProtectedRoute, GuestRoute, структура маршрутів                                                      | ✅     |
| **Сторінки**       | Dashboard, LoginPage, RegisterPage (оновлені)                                                        | ✅     |

**Результат:** готова дизайн-система, layout, навігація, базові компоненти для розробки бізнес-функцій

---

### Sprint 4 — Audit / Logging ✅

**Статус:** ✅ **Backend завершено** | ⏳ **Frontend в роботі**

| Компонент    | Завдання                                                                                               | Пріоритет   |
| ------------ | ------------------------------------------------------------------------------------------------------ | ----------- |
| **Backend**  | Audit module (AuditEvent entity, AuditRepository), Use-case: `logAction`, Middleware для логування дій | 🔴 Високий  |
| **Frontend** | UI для перегляду логів (адмін-панель)                                                                  | 🟡 Середній |

**Результат:** всі критичні дії користувачів і системи логуються

**API Endpoints:**

- `GET /api/audit` — всі логи (ADMIN)
- `GET /api/audit/my` — логи користувача
- `GET /api/audit/:id` — лог по ID (ADMIN)

**Фічі:**

- Логування входу (успіх/невдача/помилка)
- IP адреса, user agent
- Метадані (request/response)
- Фільтрація (userId, action, resource, status, date range)
- Пагінація (limit, skip)

---

### Sprint 4.5 — Audit Frontend ✅

**Статус:** ✅ **ЗАВЕРШЕНО** | **Пріоритет:** 🟡 Середній

| Компонент      | Завдання                                           | Статус |
| -------------- | -------------------------------------------------- | ------ |
| **Services**   | Audit API service (getLogs, getMyLogs, getLogById) | ✅     |
| **Types**      | AuditLog, AuditFilters, AuditStatus типи           | ✅     |
| **Components** | AuditLogTable, AuditLogFilters, AuditLogDetail     | ✅     |
| **Pages**      | AuditPage (/admin/audit)                           | ✅     |
| **Routes**     | Інтеграція з роутингом, ADMIN only                 | ✅     |

**Функціонал:**

- ✅ Таблиця логів з сортуванням
- ✅ Фільтри (action, resource, status, date range)
- ✅ Пагінація (limit, skip)
- ✅ Деталі логу (modal)
- ⏳ Експорт логів (CSV/Excel) — опціонально

**Результат:** адмін-панель для перегляду та аналізу логів

---

### Sprint 4.7 — Email Verification ✅

**Статус:** ✅ **ЗАВЕРШЕНО** | **Пріоритет:** 🟡 Середній

| Компонент                | Завдання                                                                | Статус |
| ------------------------ | ----------------------------------------------------------------------- | ------ |
| **Email Service**        | Nodemailer, SMTP transport, HTML templates                              | ✅     |
| **Verification Email**   | sendVerificationEmail() з токеном                                       | ✅     |
| **Reset Password Email** | sendResetPasswordEmail() з токеном                                      | ✅     |
| **Use-Cases**            | VerifyEmail, SendVerificationEmail, RequestResetPassword, ResetPassword | ✅     |
| **Routes**               | /resend-verification, /reset-password/\*                                | ✅     |

**Функціонал:**

- ✅ Email Service з SMTP (Gmail за замовчуванням)
- ✅ HTML шаблони листів (responsive design)
- ✅ Verification email з токеном (24 години)
- ✅ Reset password email з токеном (1 година)
- ✅ Безпека (не розкриває існування email)
- ✅ Конфігурація через ENV

**API Endpoints:**

- `POST /api/auth/resend-verification` — повторна відправка
- `POST /api/auth/reset-password/request` — запит скидання пароля
- `POST /api/auth/reset-password/confirm` — підтвердження скидання

**Конфігурація:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=Rack Calculator
```

**Результат:** повна система підтвердження email і скидання пароля

---

### Sprint 5 — Core Business Module: Rack 🔴

**Статус:** 🔴 **НЕ РОЗПОЧАТО** | **Пріоритет:** 🔴 Високий

| Компонент    | Завдання                                                                                                                                                                                                             | Пріоритет  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Backend**  | Domain: `calculateRack()` (алгоритм з `RACK_ALGORITHM_BUSINESS.md`), Value Objects (Size, Rows, Weight), RackEntity, RackRepository, Use-case: `calculateRackUseCase`, RackController, Routes: `/api/rack/calculate` | 🔴 Високий |
| **Frontend** | Сторінка калькулятора стелажів, Форма введення параметрів, Відображення результатів, Збереження конфігурацій (RackSet)                                                                                               | 🔴 Високий |

**Алгоритм розрахунку включає:**

- Розрахунок опор (крайні + проміжні)
- Розрахунок балок (за типами прольотів)
- Розрахунок вертикальних стійок (для 2+ поверхів)
- Розрахунок розпорків (для 2+ поверхів)
- Розрахунок ізоляторів (для 1 поверху)
- Генерація назви стелажа
- Розрахунок вартості (базова, без ізоляторів, нульова)

**Результат:** перший бізнес-інструмент готовий і захищений ядром додатку

---

### Sprint 6 — Battery Module ⏳

**Статус:** ⏳ **НЕ РОЗПОЧАТО**

| Компонент    | Завдання                                                                                                                                                    | Пріоритет   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **Backend**  | Domain: `calculateBatteryFit()`, BatteryEntity, BatteryRepository, Use-case: `calculateBatteryUseCase`, BatteryController, Routes: `/api/battery/calculate` | 🟡 Середній |
| **Frontend** | Сторінка підбору батарей, Інтеграція з Rack калькулятором, Відображення сумісності                                                                          | 🟡 Середній |

**Результат:** підбір батарей для стелажів працює

---

### Sprint 7 — Export / Revisions / Soft Delete ⏳

**Статус:** ⏳ **НЕ РОЗПОЧАТО**

| Компонент    | Завдання                                                                                           | Пріоритет   |
| ------------ | -------------------------------------------------------------------------------------------------- | ----------- |
| **Backend**  | Export: `exportRackSet` (Excel / PDF), Revisions: збереження версій RackSet, Soft delete / restore | 🟡 Середній |
| **Frontend** | Сторінки експорту, Управління версіями, Відновлення вилучених елементів, Фільтри і пагінація       | 🟡 Середній |

**Результат:** користувачі можуть зберігати комплекти, відновлювати і експортувати

---

### Sprint 8 — Завершення і деплой ⏳

**Статус:** ⏳ **НЕ РОЗПОЧАТО**

| Компонент  | Завдання                                                                            | Пріоритет   |
| ---------- | ----------------------------------------------------------------------------------- | ----------- |
| **DevOps** | Docker + docker-compose, CI/CD (збірка, тести, деплой), Оточення (dev/staging/prod) | 🔴 Високий  |
| **Docs**   | OpenAPI / Swagger документація                                                      | 🟡 Середній |
| **Tests**  | Unit-тести (use-cases), Integration-тести (API endpoints), E2E-тести                | 🔴 Високий  |

**Результат:** готовий проєкт до продакшену

---

## 📊 Зведена таблиця статусів

| Спринт         | Назва                                           | Backend | Frontend | Загальний статус |
| -------------- | ----------------------------------------------- | ------- | -------- | ---------------- |
| **Sprint 0**   | Підготовка проєкту                              | ✅      | ✅       | ✅ Завершено     |
| **Sprint 1**   | User Management & Auth                          | ✅      | —        | ✅ Завершено     |
| **Sprint 2**   | Frontend Auth Pages                             | ✅      | ✅       | ✅ Завершено     |
| **Sprint 3**   | Roles & RBAC                                    | ✅      | —        | ✅ Завершено     |
| **Sprint 3.5** | Frontend Foundation: Дизайн-система і структура | —       | ✅       | ✅ Завершено     |
| **Sprint 4**   | Audit / Logging                                 | ✅      | ⏳       | ✅ Завершено     |
| **Sprint 4.5** | Audit Frontend                                  | —       | ✅       | ✅ Завершено     |
| **Sprint 4.7** | Email Verification                              | ✅      | ⏳       | ✅ Завершено     |
| **Sprint 5**   | Core Business Module: Rack                      | 🔴      | 🔴       | 🔴 Не розпочато  |
| **Sprint 6**   | Battery Module                                  | ⏳      | ⏳       | ⏳ Не розпочато  |
| **Sprint 7**   | Export / Revisions / Soft Delete                | ⏳      | ⏳       | ⏳ Не розпочато  |
| **Sprint 8**   | Завершення і деплой                             | ⏳      | ⏳       | ⏳ Не розпочато  |

---

## 📈 Прогрес проєкту

```
Backend:  ██████████████████░░░░ 60%
Frontend: ██████████████░░░░░░░░ 35%
Tests:    █░░░░░░░░░░░░░░░░░░░░░  5%
Docs:     ██████████████████████ 100%
```

---

## ⚠️ Технічні борги

| Проблема              | Пріоритет   | Опис                                          |
| --------------------- | ----------- | --------------------------------------------- |
| **Rack domain logic** | 🔴 Високий  | Структура є, алгоритм не реалізований         |
| **Frontend тести**    | 🔴 Високий  | Тести UI компонентів не створені              |
| **Backend тести**     | 🔴 Високий  | Unit/integration тести не написані            |
| **Email integration** | 🟡 Середній | Frontend сторінки verification/reset-password |

---

## 🚀 Наступні кроки (пріоритети)

### 🔴 Спринт 5: Rack Module (1-2 тижні)

1. **Sprint 5 (Rack Backend)** — реалізувати domain-логіку розрахунку стелажів:
   - Domain: `calculateRack()` за алгоритмом з `RACK_ALGORITHM_BUSINESS.md`
   - Value Objects: Size, Rows, Weight
   - RackEntity, RackRepository
   - Use-case: `calculateRackUseCase`
   - RackController + Routes: `/api/rack/calculate`

2. **Sprint 5 (Rack Frontend)** — створити інтерфейс калькулятора стелажів:
   - Сторінка `/rack/calculator`
   - Форма введення параметрів
   - Відображення результатів
   - Збереження конфігурацій (RackSet)

### 🟡 Наступні пріоритети

3. **Email Integration (Frontend)** — сторінки для email verification:
   - Сторінка `/verify-email` — підтвердження email
   - Сторінка `/reset-password` — скидання пароля
   - Інтеграція з backend API

4. **Тести** — покрити unit-тестами use-cases (auth, rbac, audit, email, rack)

5. **Sprint 6 (Battery Module)** — підбір батарей

---

## 📁 Структура проєкту

```
rack-calculator-v2/
├── client/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # UI компоненти
│   │   ├── hooks/             # Кастомні хуки
│   │   ├── pages/             # Сторінки (Login, Register, Profile, Rack, Battery...)
│   │   ├── services/          # API client, auth service, rack service...
│   │   ├── stores/            # Zustand stores (auth, rack...)
│   │   ├── types/             # TypeScript типи
│   │   └── utils/             # Утиліти, validation
│   └── package.json
│
├── server/                     # Node.js + Express + Prisma
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Автентифікація ✅
│   │   │   ├── users/         # Користувачі ✅
│   │   │   ├── roles/         # Ролі і права ✅
│   │   │   ├── permissions/   # Дозволи ✅
│   │   │   ├── rack/          # Розрахунок стелажів ⚠️
│   │   │   ├── battery/       # Підбір батарей 🔴
│   │   │   ├── audit/         # Логування 🔴
│   │   │   └── common/        # Спільні утиліти
│   │   ├── config/            # Конфігурація (ENV, DB, JWT)
│   │   ├── db/                # DB підключення (prisma.client.ts)
│   │   ├── routes.ts          # Маршрути
│   │   └── server.ts          # Точка входу
│   └── package.json
│
├── price/                      # База цін
└── документація
```

---

## 🛠️ Технологічний стек

### Backend

| Технологія           | Призначення           |
| -------------------- | --------------------- |
| Node.js + TypeScript | Платформа + типізація |
| Express 5.x          | Web-фреймворк         |
| Prisma 5.x (MongoDB) | ORM + база даних      |
| Zod                  | Валідація даних       |
| JWT (jsonwebtoken)   | Токени автентифікації |
| Vitest               | Тестування            |
| tsx                  | ES modules            |

### Frontend

| Технологія      | Призначення        |
| --------------- | ------------------ |
| React 19        | UI-бібліотека      |
| TypeScript      | Типізація          |
| Vite            | Збірник            |
| TanStack Query  | Робота з сервером  |
| Zustand         | State management   |
| React Hook Form | Управління формами |
| Zod             | Валідація форм     |
| Axios           | HTTP-клієнт        |
| React Router    | Маршрутизація      |

### DevOps

| Технологія              | Призначення        |
| ----------------------- | ------------------ |
| Docker + docker-compose | Контейнеризація    |
| concurrently            | Паралельний запуск |
| npm workspaces          | Monorepo           |

---

## 🔗 Посилання на документацію

- [STATUS.md](./STATUS.md) — статус проєкту
- [RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md) — алгоритм розрахунку стелажів
- [summory.md](./summory.md) — технічне резюме проєкту
- [backend-sturcure.md](./backend-sturcure.md) — структура бекенду
