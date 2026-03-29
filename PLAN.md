# 📋 План розробки Rack Calculator V2

> **Статус:** Sprint 5.5 (Admin Price Editor) — ✅ **ЗАВЕРШЕНО**  
> **Останнє оновлення:** 27 березня 2026 р.  
> **Git:** `feature/price-editor` (актуальна)

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

### Sprint 5.5 — Admin Price Editor ✅

**Статус:** ✅ **ЗАВЕРШЕНО** | **Пріоритет:** 🔴 **ВИСОКИЙ**

| Компонент    | Завдання                                                                                                                              | Статус |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **Backend**  | ✅ Нова структура Price з items, ✅ Bulk update, ✅ Import/Export Excel, ✅ Сортування, ✅ Strategy Pattern, ✅ Unit Tests (32 тести) | ✅     |
| **Frontend** | ✅ Admin Prices сторінка, ✅ Таблиця елементів, ✅ Редагування, ✅ Імпорт/Експорт                                                     | ✅     |

**Функціонал:**

1. **Нова структура прайсу**
   - Масив `items` замість вкладених об'єктів
   - Варіанти для опор (edge/intermediate)
   - Унікальні ID для кожного елемента

2. **Strategy Pattern**
   - `IPriceStrategy` інтерфейс
   - `RackPriceStrategy` реалізація
   - `PriceProcessorService` для обробки
   - Легке додавання нових типів прайсів

3. **Перегляд прайсів у вигляді таблиці**
   - Сортування за типом і розміром
   - Підсвітка змін

4. **Редагування / Додавання нових позицій**
   - Додавання нових елементів
   - Редагування існуючих
   - Видалення позицій

5. **Експорт**
   - Експорт в Excel (.xlsx)
   - Експорт в CSV

6. **Імпорт**
   - Імпорт з Excel (.xlsx)
   - Валідація даних
   - Оновлення існуючих і додавання нових

7. **Unit Tests**
   - 18 тестів для `RackPriceStrategy`
   - 14 тестів для `PriceProcessorService`
   - 100% pass rate

**API Endpoints:**

- `PUT /api/prices/bulk` — масове оновлення цін (ADMIN)
- `POST /api/prices/import` — імпорт прайсів з файлу (ADMIN)
- `GET /api/prices/:id/export` — експорт прайсів (ADMIN)
- `GET /api/prices/all` — всі прайси (ADMIN)
- `POST /api/prices/:id/activate` — активувати (ADMIN)
- `POST /api/prices/:id/deactivate` — деактивувати (ADMIN)
- `DELETE /api/prices/:id` — видалити (ADMIN)

**Створені компоненти:**

- `PriceItemsTable` (таблиця з сортуванням)
- `EditItemModal` (додавання/редагування)
- `AdminPricesPage` (List/Detail вигляд)

**Створені стратегії:**

- `RackPriceStrategy` (реалізовано)
- `BatteryPriceStrategy` (майбутній)

**Документація:**

- [price.md](./price.md) — архітектура модуля
- [server/src/modules/price/ARCHITECTURE.md](./server/src/modules/price/ARCHITECTURE.md) — Strategy Pattern
- [server/src/modules/price/TESTS.md](./server/src/modules/price/TESTS.md) — unit-тести

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
| **Frontend** | Сторінки експорту, Управління версіями, Відновлення вилучених елемен                               |
