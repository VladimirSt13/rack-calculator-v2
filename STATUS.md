# 📊 Статус проєкту Rack Calculator V2

> **Дата оновлення:** 23 березня 2026 р.
> **Гілка:** `main` ✅
> **Останній коміт:** 8db744c — Merge pull request #7 (feature/tech-debts-fix)

---

## 🎯 Загальний стан

| Компонент        | Статус                            | Готовність |
| ---------------- | --------------------------------- | ---------- |
| **Backend**      | 🟢 Готово (Sprint 1-4.7)          | ~60%       |
| **Frontend**     | 🟢 Audit UI (Sprint 4.5)          | ~35%       |
| **База даних**   | 🟢 Налаштована (Prisma + MongoDB) | ✅         |
| **Тести**        | 🟡 Jest налаштований              | 5%         |
| **Документація** | 🟢 Актуальна                      | ✅         |

---

## 📅 Спринти

| Спринт         | Назва                               | Статус          | Completion |
| -------------- | ----------------------------------- | --------------- | ---------- |
| **Sprint 0**   | Підготовка проєкту                  | ✅ Завершено    | 100%       |
| **Sprint 1**   | User Management & Auth              | ✅ Завершено    | 100%       |
| **Sprint 2**   | Frontend Auth Pages                 | ✅ Завершено    | 100%       |
| **Sprint 3**   | Roles & RBAC                        | ✅ Завершено    | 100%       |
| **Sprint 3.5** | Frontend Foundation: Дизайн-система | ✅ Завершено    | 100%       |
| **Sprint 4**   | Audit / Logging                     | ✅ Завершено    | 100%       |
| **Sprint 4.5** | Audit Frontend                      | ✅ Завершено    | 100%       |
| **Sprint 4.7** | Email Verification                  | ✅ Завершено    | 100%       |
| **Sprint 5**   | Core Business Module: Rack          | 🔴 Не розпочато | 0%         |
| **Sprint 6**   | Battery Module                      | ⏳ Не розпочато | 0%         |
| **Sprint 7**   | Export / Revisions / Soft Delete    | ⏳ Не розпочато | 0%         |
| **Sprint 8**   | Завершення і деплой                 | ⏳ Не розпочато | 0%         |

---

## ✅ Виконані завдання

### Backend (Sprint 1)

- [x] Ініціалізація Node.js + TypeScript проєкту
- [x] Monorepo структура (client + server workspaces)
- [x] Налаштування ESLint, Prettier, Vitest
- [x] Prisma schema (MongoDB) — User, Role
- [x] Модуль `users`:
  - [x] UserRepository (findById, update, setRefreshToken)
- [x] Модуль `auth`:
  - [x] Use-cases: RegisterUser, LoginUser, ResetPassword, VerifyEmail
  - [x] JwtService (accessToken, refreshToken)
  - [x] Auth middleware
  - [x] Auth controller (всі маршрути /api/auth/\*)
- [x] Prisma singleton (prisma.client.ts)
- [x] Конфігурація (ENV, DB, JWT, CORS)
- [x] Server entry point + routes
- [x] tsx для ES modules

### Frontend (Sprint 2)

- [x] Налаштування проєкту (React + TypeScript + Vite)
- [x] Структура папок (components, hooks, pages, services, stores, types, utils)
- [x] Залежності встановлені (React, TanStack Query, Zustand, React Hook Form, Zod, Axios)
- [x] API client з interceptors
- [x] Auth service (login, register, logout, getCurrentUser, resetPassword)
- [x] Zustand auth store
- [x] Валідація форм (Zod + React Hook Form)
- [x] Сторінки:
  - [x] `/login` — Вхід
  - [x] `/register` — Реєстрація
  - [x] `/profile` — Профіль
- [x] React Router
- [x] Стилі для auth форм

### DevOps

- [x] `npm run dev` — запускає обидва додатки одночасно
- [x] concurrently встановлений

### Backend (Sprint 4)

- [x] Модуль `audit`:
  - [x] Prisma schema: AuditEvent (MongoDB)
  - [x] AuditEvent entity, AuditAction VO, AuditResource VO
  - [x] AuditRepository (CRUD, filters, pagination)
  - [x] Use-cases: LogAuditAction, GetAuditLogs
  - [x] AuditController (GET /api/audit, /my, /:id)
  - [x] Audit middleware (auto-logging)
- [x] Middleware `requireRole` для перевірки ролей
- [x] Інтеграція з auth:
  - [x] Логування входу (успіх/невдача/помилка)
  - [x] IP адреса, user agent
  - [x] Метадані (request/response)

### Frontend (Sprint 3.5)

- [x] Налаштування дизайн-системи:
  - [x] Tailwind CSS v4
  - [x] shadcn/ui (16 компонентів)
  - [x] Storybook
  - [x] prettier-plugin-tailwindcss
- [x] UI-компоненти:
  - [x] Button, Input, Label, Select, Checkbox, RadioGroup
  - [x] Card, Table, Dialog, DropdownMenu
  - [x] Sonner, Skeleton, Spinner, Avatar, Badge, ScrollArea, Separator
- [x] Layout-компоненти:
  - [x] Header (логотип, теми, уведомления, профіль)
  - [x] Sidebar (навігація з розділами)
  - [x] AppLayout (адаптивний)
- [x] Роутинг:
  - [x] ProtectedRoute
  - [x] GuestRoute
- [x] Сторінки:
  - [x] DashboardPage
  - [x] LoginPage (оновлена)
  - [x] RegisterPage (оновлена)

### Frontend (Sprint 4.5)

- [x] Types:
  - [x] AuditLog, AuditFilters, AuditStatus
  - [x] AuditAction, AuditResource
- [x] Services:
  - [x] audit.service.ts (getLogs, getMyLogs, getLogById)
- [x] Components:
  - [x] AuditLogFilters (фільтри по статусу, ресурсу, дії, датам)
  - [x] AuditLogTable (таблиця з badges)
  - [x] AuditLogDetail (modal з деталями)
- [x] Pages:
  - [x] AuditPage (/admin/audit)
- [x] Routes:
  - [x] /admin/audit (ADMIN only)
  - [x] Sidebar link updated

### Документація

- [x] RACK_ALGORITHM_BUSINESS.md — бізнес-алгоритм розрахунку стелажів
- [x] PLAN.md — **об'єднаний план розробки** (server + client)
- [x] summory.md — технічне резюме
- [x] backend-sturcure.md — структура бекенду
- [x] STATUS.md — статус проєкту

---

## ⚠️ Технічні борги

| Проблема               | Пріоритет   | Опис                                          |
| ---------------------- | ----------- | --------------------------------------------- |
| **Rack domain logic**  | 🔴 Високий  | Структура є, алгоритм не реалізований         |
| **Відсутність тестів** | 🔴 Високий  | Unit і integration тести не створені          |
| **Email verification** | 🟡 Середній | Frontend сторінки verification/reset-password |
| **Battery logic**      | 🟡 Середній | Модуль не розпочатий                          |

---

## 🚀 Наступні кроки

### Короткострокові (1-2 тижні)

1. **Sprint 5: Rack Module (Backend)** — 🔴 ПРІОРИТЕТ
   - Реалізувати domain-функцію `calculateRack()` по алгоритму з `RACK_ALGORITHM_BUSINESS.md`
   - Створити Value Objects (Size, Rows, Weight)
   - Створити RackEntity
   - Реалізувати RackRepository
   - Створити Use-case `calculateRackUseCase`
   - Створити RackController + маршрути `/api/rack/calculate`

2. **Sprint 5: Rack Module (Frontend)**
   - Сторінка калькулятора стелажів `/rack/calculator`
   - Форма введення параметрів
   - Відображення результатів
   - Збереження конфігурацій (RackSet)

### Середньострокові (3-4 тижні)

3. **Sprint 6: Battery Module**
   - Domain-логіка підбору батарей
   - UI для розрахунку

4. **Тестування**
   - Покрити unit-тестами use-cases (auth, rack, rbac, audit)
   - Integration тести для API endpoints

5. **Email Frontend**
   - Сторінки `/verify-email` і `/reset-password`

---

## 📦 Структура модулів (реалізовано / потрібно)

### Backend модулі

| Модуль      | Domain | Application | Infrastructure | Interfaces | Статус          |
| ----------- | ------ | ----------- | -------------- | ---------- | --------------- |
| **auth**    | —      | ✅          | ✅             | ✅         | ✅ Завершено    |
| **users**   | ✅     | —           | ✅             | —          | ✅ Завершено    |
| **roles**   | ✅     | ✅          | ✅             | ✅         | ✅ Завершено    |
| **perms**   | ✅     | —           | ✅             | ✅         | ✅ Завершено    |
| **rack**    | 🔴     | 🔴          | 🔴             | 🔴         | 🔴 Не розпочато |
| **battery** | 🔴     | 🔴          | 🔴             | 🔴         | 🔴 Не розпочато |
| **audit**   | ✅     | ✅          | ✅             | ✅         | ✅ Завершено    |
| **email**   | —      | ✅          | ✅             | ✅         | ✅ Завершено    |
| **price**   | —      | —           | ✅             | ✅         | ✅ Завершено    |

### Frontend структура

| Компонент               | Статус            | Опис                                |
| ----------------------- | ----------------- | ----------------------------------- |
| **components/ui/**      | ✅ 16 компонентів | shadcn/ui компоненти                |
| **components/layout/**  | ✅                | Header, Sidebar, AppLayout          |
| **components/routing/** | ✅                | ProtectedRoute, GuestRoute          |
| **hooks/**              | 🔴 Пусто          | Кастомні хуки                       |
| **pages/**              | ✅ 4 сторінки     | Dashboard, Login, Register, Profile |
| **services/**           | ✅ Auth           | API client, auth service            |
| **stores/**             | ✅ Auth           | Zustand auth store                  |
| **types/**              | 🔴 Пусто          | TypeScript типи                     |
| **utils/**              | ✅ Validation     | Zod схеми                           |

---

## 🛠️ Технології

### Backend

- Node.js + TypeScript
- Express 5.x
- Prisma 5.x (MongoDB)
- Zod (валідація)
- JWT (jsonwebtoken)
- mongodb (ObjectId)
- Vitest (тести)
- tsx (ES modules)

### Frontend

- React 19
- TypeScript
- Vite
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios
- React Router

---

## 📈 Метрики прогресу

```
Backend:  ████████████████░░░░░░ 60%
Frontend: █████████░░░░░░░░░░░░░ 35%
Tests:    █░░░░░░░░░░░░░░░░░░░░░  5%
Docs:     ██████████████████████ 100%
```

---

## 🔗 Ресурси

- **Репозиторій:** https://github.com/VladimirSt13/rack-calculator-v2
- **План розробки:** [PLAN.md](./PLAN.md)
- **Алгоритм:** [RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md)
- **Структура бекенду:** [backend-sturcure.md](./backend-sturcure.md)
- **Технічне резюме:** [summory.md](./summory.md)
