# 📋 План розробки Rack Calculator V2

> **Статус:** Sprint 5 (Rack Module) — ✅ **ЗАВЕРШЕНО**
> **Останнє оновлення:** 26 березня 2026 р.
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

### Стек та інструменти

| Рішення           | Опис                                                   | Статус |
| ----------------- | ------------------------------------------------------ | ------ |
| **UI-бібліотека** | **shadcn/ui** — компоненти на базі Radix UI + Tailwind | ✅     |
| **Стилі**         | Tailwind CSS v4                                        | ✅     |
| **Стиль**         | Сучасний мінімалізм                                    | ✅     |
| **Теми**          | Світла + темна (auto-switch)                           | ✅     |
| **Кольори**       | Акцент: темно-синій (`slate-900` / `blue-700`)         | ✅     |
| **Storybook**     | Документація компонентів                               | ✅     |
| **Адаптивність**  | Fully responsive (mobile-first)                        | ✅     |

### Встановлені компоненти

- **Базові:** Button, Input, Label, Select, Checkbox, RadioGroup, Textarea
- **Контейнери:** Card, Table, Dialog, DropdownMenu, ScrollArea, Separator
- **Зворотний зв'язок:** Sonner (toast), Skeleton, Spinner, Badge
- **Інші:** Avatar, ClearButton

### Layout компоненти

- **Header** — логотип, навігація, теми, повідомлення, профіль
- **Sidebar** — бічне меню з розділами
- **AppLayout** — адаптивний layout з mobile sidebar

---

## 📅 Дорожня карта спринтів

### Sprint 0 — Підготовка проєкту ✅

**Статус:** ✅ **ЗАВЕРШЕНО**

| Компонент    | Завдання                                                           | Статус |
| ------------ | ------------------------------------------------------------------ | ------ |
| **Backend**  | Node.js + TypeScript + Express, Prisma (MongoDB), Zod, JWT, Vitest | ✅     |
| **Frontend** | React + TypeScript + Vite, структура папок                         | ✅     |
| **DevOps**   | Monorepo (workspaces), concurrently, ESLint, Prettier              | ✅     |

---

### Sprint 1 — User Management & Auth ✅

**Статус:** ✅ **ЗАВЕРШЕНО**

| Компонент    | Завдання                                                               | Статус |
| ------------ | ---------------------------------------------------------------------- | ------ |
| **Backend**  | Users module, Auth module, JWT Service, Auth Middleware, Prisma schema | ✅     |
| **Frontend** | API client, Auth service, Zustand store, Форми, Сторінки               | ✅     |

**API Endpoints:**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/reset-password/request`
- `POST /api/auth/reset-password/confirm`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

---

### Sprint 2 — Frontend Auth Pages ✅

**Статус:** ✅ **ЗАВЕРШЕНО**

**Сторінки:**

- `/login` — вхід
- `/register` — реєстрація
- `/profile` — профіль користувача

---

### Sprint 3 — Roles & RBAC ✅

**Статус:** ✅ **ЗАВЕРШЕНО**

| Компонент   | Завдання                                                         | Статус |
| ----------- | ---------------------------------------------------------------- | ------ |
| **Backend** | Roles module, Permissions module, PolicyService, RBAC Middleware | ✅     |

**API Endpoints:**

- `GET/POST /api/roles`
- `GET/PUT/DELETE /api/roles/:id`
- `POST/DELETE /api/roles/:id/permissions`
- `GET/POST /api/permissions`

**Middleware:**

- `requirePermission(resource, action)`
- `requireAnyPermission([...])`
- `requireRole(roleName)`

---

### Sprint 3.5 — Frontend Foundation: Дизайн-система ✅

**Статус:** ✅ **ЗАВЕРШЕНО**

| Компонент          | Завдання                                                                                             | Статус |
| ------------------ | ---------------------------------------------------------------------------------------------------- | ------ |
| **Інфраструктура** | Tailwind CSS v4, shadcn/ui, Storybook, ESLint/Prettier правила                                       | ✅     |
| **UI-компоненти**  | Button, Input, Select, Checkbox, Radio, Card, Table, Dialog, DropdownMenu, Sonner, Skeleton, Spinner | ✅     |
| **Layout**         | AppLayout, Header, Sidebar, NavMenu                                                                  | ✅     |
| **Роутинг**        | ProtectedRoute, GuestRoute, структура маршрутів                                                      | ✅     |

---

### Sprint 4 — Audit / Logging ✅

**Статус:** ✅ **ЗАВЕРШЕНО**

| Компонент   | Завдання                                                                                               | Статус |
| ----------- | ------------------------------------------------------------------------------------------------------ | ------ |
| **Backend** | Audit module (AuditEvent entity, AuditRepository), Use-case: `logAction`, Middleware для логування дій | ✅     |

**API Endpoints:**

- `GET /api/audit` — всі логи (ADMIN)
- `GET /api/audit/my` — логи користувача
- `GET /api/audit/:id` — лог по ID (ADMIN)

---

### Sprint 4.5 — Audit Frontend ✅

**Статус:** ✅ **ЗАВЕРШЕНО**

| Компонент      | Завдання                                           | Статус |
| -------------- | -------------------------------------------------- | ------ |
| **Services**   | Audit API service (getLogs, getMyLogs, getLogById) | ✅     |
| **Types**      | AuditLog, AuditFilters, AuditStatus типи           | ✅     |
| **Components** | AuditLogTable, AuditLogFilters, AuditLogDetail     | ✅     |
| **Pages**      | AuditPage (/admin/audit)                           | ✅     |

---

### Sprint 4.7 — Email Verification ✅

**Статус:** ✅ **ЗАВЕРШЕНО**

| Компонент                | Завдання                                                                | Статус |
| ------------------------ | ----------------------------------------------------------------------- | ------ |
| **Email Service**        | Nodemailer, SMTP transport, HTML templates                              | ✅     |
| **Verification Email**   | sendVerificationEmail() з токеном                                       | ✅     |
| **Reset Password Email** | sendResetPasswordEmail() з токеном                                      | ✅     |
| **Use-Cases**            | VerifyEmail, SendVerificationEmail, RequestResetPassword, ResetPassword | ✅     |

**API Endpoints:**

- `POST /api/auth/resend-verification`
- `POST /api/auth/reset-password/request`
- `POST /api/auth/reset-password/confirm`

---

### Sprint 5 — Core Business Module: Rack ✅

**Статус:** ✅ **ЗАВЕРШЕНО** | **Пріоритет:** 🔴 Високий

| Компонент    | Завдання                                                                                                                                              | Статус |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Backend**  | Domain: `calculateRack()`, Value Objects, RackEntity, RackRepository, Use-case: `calculateRackUseCase`, RackController, Routes: `/api/rack/calculate` | ✅     |
| **Frontend** | Сторінка калькулятора стелажів, Форма введення параметрів, Відображення результатів, Збереження конфігурацій (RackSet)                                | ✅     |

---

### Sprint 5.5 — Admin Price Editor 🔴 НОВЕ

**Статус:** ⏳ **В РОБОТІ** | **Пріоритет:** 🔴 **ВИСОКИЙ**

| Компонент    | Завдання                                                                                              | Статус |
| ------------ | ----------------------------------------------------------------------------------------------------- | ------ |
| **Backend**  | Оновлення Price API: bulk update, import/export, валідація даних                                      | ⏳     |
| **Frontend** | Сторінка адмін-панелі для редагування прайсів (Excel-подібний UI), імпорт/експорт, масове редагування | ⏳     |

**Функціонал:**

1. **Перегляд прайсів у вигляді таблиці** (Excel/Google Sheets стиль)
   - Редаговані клітинки (inline editing)
   - Швидке заповнення (auto-fill)
   - Підсвітка змін

2. **Редагування / Додавання нових позицій**
   - Додавання нових категорій
   - Масове оновлення цін
   - Видалення позицій

3. **Експорт**
   - Експорт в Excel (.xlsx)
   - Експорт в CSV
   - Експорт поточного фільтрованого вигляду

4. **Імпорт**
   - Імпорт з Excel (.xlsx)
   - Імпорт з CSV
   - Валідація даних перед збереженням
   - Попередній перегляд змін

**API Endpoints (оновлення):**

- `PUT /api/prices/bulk` — масове оновлення цін (ADMIN)
- `POST /api/prices/import` — імпорт прайсів з файлу (ADMIN)
- `GET /api/prices/export?format=xlsx|csv` — експорт прайсів (ADMIN)

**Backend завдання:**

- [ ] Оновити PriceController: додати bulk update endpoint
- [ ] Створити Use-case: `BulkUpdatePrices`, `ImportPrices`, `ExportPrices`
- [ ] Додати валідацію імпортованих даних (Zod схема)
- [ ] Інтеграція з `xlsx` бібліотекою (ExcelJS або similar)
- [ ] Додати middleware перевірки ADMIN ролі

**Frontend завдання:**

- [ ] Створити сторінку `/admin/prices` (ADMIN only)
- [ ] Компонент PriceTableEditor (Excel-подібна таблиця)
  - Inline editing клітинок
  - Підсвітка змінених комірок
  - Швидке копіювання/вставка
- [ ] Компонент PriceImportModal (імпорт файлів)
  - Drag-and-drop зона
  - Попередній перегляд даних
  - Валідація перед імпортом
- [ ] Компонент PriceExportButton (експорт)
  - Вибір формату (XLSX, CSV)
  - Вибір категорій для експорту
- [ ] Services: priceAdmin.service.ts (bulkUpdate, import, export)
- [ ] Types: PriceEntry, PriceCategory, PriceImportResult
- [ ] Додати посилання в Sidebar (ADMIN розділ)

**Алгоритм розрахунку включає:**

- Розрахунок опор (крайні + проміжні)
- Розрахунок балок (за типами прольотів)
- Розрахунок вертикальних стійок (для 2+ поверхів)
- Розрахунок розпорків (для 2+ поверхів)
- Розрахунок ізоляторів (для 1 поверху)
- Генерація назви стелажа
- Розрахунок вартості (базова, без ізоляторів, нульова)

**API Endpoints:**

- `POST /api/rack/calculate` — розрахунок стелажа
- `GET /api/rack/my` — мої розрахунки
- `GET /api/rack/:id` — деталі розрахунку

**Створені компоненти:**

- RackForm (форма з динамічними прольотами)
- RackResults (відображення результатів)
- PreambleCard (короткі результати)
- ComponentsTableCard (таблиця з цінами)
- PriceDisplay (форматування цін)
- RackSetCard (панель комплекту)
- SaveSetModal (модальне вікно збереження)
- ResultsSkeleton (скелетон завантаження)

---

### Sprint 6 — Battery Module ⏳

**Статус:** ⏳ **НЕ РОЗПОЧАТО**

| Компонент    | Завдання                                                                                                                                                    | Пріоритет   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **Backend**  | Domain: `calculateBatteryFit()`, BatteryEntity, BatteryRepository, Use-case: `calculateBatteryUseCase`, BatteryController, Routes: `/api/battery/calculate` | 🟡 Середній |
| **Frontend** | Сторінка підбору батарей, Інтеграція з Rack калькулятором, Відображення сумісності                                                                          | 🟡 Середній |

---

### Sprint 7 — Export / Revisions / Soft Delete ⏳

**Статус:** ⏳ **НЕ РОЗПОЧАТО**

| Компонент    | Завдання                                                                                           | Пріоритет   |
| ------------ | -------------------------------------------------------------------------------------------------- | ----------- |
| **Backend**  | Export: `exportRackSet` (Excel / PDF), Revisions: збереження версій RackSet, Soft delete / restore | 🟡 Середній |
| **Frontend** | Сторінки експорту, Управління версіями, Відновлення вилучених елементів, Фільтри і пагінація       | 🟡 Середній |

---

### Sprint 8 — Завершення і деплой ⏳

**Статус:** ⏳ **НЕ РОЗПОЧАТО**

| Компонент  | Завдання                                                                            | Пріоритет   |
| ---------- | ----------------------------------------------------------------------------------- | ----------- |
| **DevOps** | Docker + docker-compose, CI/CD (збірка, тести, деплой), Оточення (dev/staging/prod) | 🔴 Високий  |
| **Docs**   | OpenAPI / Swagger документація                                                      | 🟡 Середній |
| **Tests**  | Unit-тести (use-cases), Integration-тести (API endpoints), E2E-тести                | 🔴 Високий  |

---

## 📊 Зведена таблиця статусів

| Спринт         | Назва                               | Backend | Frontend | Загальний статус |
| -------------- | ----------------------------------- | ------- | -------- | ---------------- |
| **Sprint 0**   | Підготовка проєкту                  | ✅      | ✅       | ✅ Завершено     |
| **Sprint 1**   | User Management & Auth              | ✅      | ✅       | ✅ Завершено     |
| **Sprint 2**   | Frontend Auth Pages                 | ✅      | ✅       | ✅ Завершено     |
| **Sprint 3**   | Roles & RBAC                        | ✅      | —        | ✅ Завершено     |
| **Sprint 3.5** | Frontend Foundation: Дизайн-система | —       | ✅       | ✅ Завершено     |
| **Sprint 4**   | Audit / Logging                     | ✅      | —        | ✅ Завершено     |
| **Sprint 4.5** | Audit Frontend                      | —       | ✅       | ✅ Завершено     |
| **Sprint 4.7** | Email Verification                  | ✅      | ⏳       | ✅ Завершено     |
| **Sprint 5**   | Core Business Module: Rack          | ✅      | ✅       | ✅ Завершено     |
| **Sprint 5.5** | Admin Price Editor                  | 🔴      | 🔴       | 🔴 В роботі      |
| **Sprint 6**   | Battery Module                      | ⏳      | ⏳       | ⏳ Не розпочато  |
| **Sprint 7**   | Export / Revisions / Soft Delete    | ⏳      | ⏳       | ⏳ Не розпочато  |
| **Sprint 8**   | Завершення і деплой                 | ⏳      | ⏳       | ⏳ Не розпочато  |

---

## 📈 Прогрес проєкту

```
Backend:  ██████████████████████░░ 75%
Frontend: █████████████████░░░░░░░ 55%
Tests:    █░░░░░░░░░░░░░░░░░░░░░░░  5%
Docs:     ████████████████████████ 100%
```

---

## ⚠️ Технічні борги

| Проблема               | Пріоритет   | Опис                                 |
| ---------------------- | ----------- | ------------------------------------ |
| **Відсутність тестів** | 🔴 Високий  | Unit/integration тести не написані   |
| **Email Frontend**     | 🟡 Середній | Сторінки verification/reset-password |
| **Battery logic**      | 🟡 Середній | Модуль не розпочатий                 |
| **E2E тести**          | 🟡 Середній | Повністю відсутні                    |
| **Docker/CI/CD**       | 🟡 Середній | Не налаштовано                       |

---

## 🚀 Наступні кроки (пріоритети)

### 🔴 Спринт 5.5: Admin Price Editor (1 тиждень)

1. **Backend** — оновлення Price API:
   - `PUT /api/prices/bulk` — масове оновлення цін
   - `POST /api/prices/import` — імпорт з Excel/CSV
   - `GET /api/prices/export` — експорт в Excel/CSV
   - Use-cases: `BulkUpdatePrices`, `ImportPrices`, `ExportPrices`
   - Інтеграція з ExcelJS

2. **Frontend** — адмін-панель для прайсів:
   - Сторінка `/admin/prices` (ADMIN only)
   - PriceTableEditor (Excel-подібна таблиця з inline editing)
   - PriceImportModal (drag-and-drop + preview)
   - PriceExportButton (експорт в XLSX/CSV)

### 🔴 Спринт 6: Battery Module (1-2 тижні)

1. **Battery Backend** — реалізувати domain-логіку підбору батарей:
   - Domain: `calculateBatteryFit()`
   - BatteryEntity, BatteryRepository
   - Use-case: `calculateBatteryUseCase`
   - BatteryController + Routes: `/api/battery/calculate`

2. **Battery Frontend** — створити інтерфейс підбору батарей:
   - Сторінка `/battery`
   - Форма введення параметрів
   - Відображення результатів
   - Інтеграція з Rack калькулятором

### 🟡 Наступні пріоритети

3. **Тести** — покрити unit-тестами use-cases (auth, rack, rbac, audit, email, battery)

4. **Email Frontend** — сторінки для email verification:
   - Сторінка `/verify-email` — підтвердження email
   - Сторінка `/reset-password` — скидання пароля

5. **Sprint 7 (Export/Revisions)** — експорт в Excel, версіонування

6. **Sprint 8 (Deployment)** — Docker, CI/CD, production готовність

---

## 📁 Структура проєкту

```
rack-calculator-v2/
├── client/                     # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # UI компоненти
│   │   │   ├── ui/            # shadcn/ui компоненти
│   │   │   ├── layout/        # Header, Sidebar, AppLayout
│   │   │   └── rack/          # Rack модуль
│   │   ├── hooks/             # Кастомні хуки
│   │   ├── pages/             # Сторінки
│   │   ├── services/          # API client, auth service, rack service
│   │   ├── stores/            # Zustand stores (auth, rackSet)
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
│   │   │   ├── rack/          # Розрахунок стелажів ✅
│   │   │   ├── battery/       # Підбір батарей 🔴
│   │   │   ├── audit/         # Логування ✅
│   │   │   ├── email/         # Email сервіс ✅
│   │   │   ├── price/         # Модуль цін ✅
│   │   │   └── common/        # Спільні утиліти
│   │   ├── config/            # Конфігурація (ENV, DB, JWT)
│   │   ├── db/                # DB підключення (prisma.client.ts)
│   │   ├── routes.ts          # Маршрути
│   │   └── server.ts          # Точка входу
│   └── package.json
│
├── price/                      # База цін
│   ├── PRICE_DB_STRUCTURE.md
│   ├── price.txt
│   └── price.xlsx
│
└── документация
    ├── README.md
    ├── PLAN.md
    ├── STATUS.md
    ├── RACK_ALGORITHM_BUSINESS.md
    ├── rack-form-description.md
    └── rack-results-description.md
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
| Vitest/Jest          | Тестування            |
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
- [rack-form-description.md](./rack-form-description.md) — опис форми
- [rack-results-description.md](./rack-results-description.md) — опис результатів
- [price/PRICE_DB_STRUCTURE.md](./price/PRICE_DB_STRUCTURE.md) — структура бази цін
