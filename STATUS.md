# 📊 Статус проекта Rack Calculator V2

> **Дата обновления:** 22 марта 2026 г.
> **Ветка:** `feature/tech-debts-fix` (Email Verification ✅)
> **Последний коммит:** — feat(server): Email Verification Implementation

---

## 🎯 Общее состояние

| Компонент        | Статус                          | Готовность |
| ---------------- | ------------------------------- | ---------- |
| **Backend**      | 🟢 Готово (Sprint 1-4.7)        | ~60%       |
| **Frontend**     | 🟢 Audit UI (Sprint 4.5)        | ~35%       |
| **База данных**  | 🟢 Настроена (Prisma + MongoDB) | ✅         |
| **Тесты**        | 🟡 Jest настроен (9 тестов)     | 20%        |
| **Документация** | 🟢 Актуальна                    | ✅         |

---

## 📅 Спринты

| Спринт         | Название                            | Статус      | Completion |
| -------------- | ----------------------------------- | ----------- | ---------- |
| **Sprint 0**   | Подготовка проекта                  | ✅ Завершён | 100%       |
| **Sprint 1**   | User Management & Auth              | ✅ Завершён | 100%       |
| **Sprint 2**   | Frontend Auth Pages                 | ✅ Завершён | 100%       |
| **Sprint 3**   | Roles & RBAC                        | ✅ Завершён | 100%       |
| **Sprint 3.5** | Frontend Foundation: Дизайн-система | ✅ Завершён | 100%       |
| **Sprint 4**   | Audit / Logging                     | ✅ Завершён | 100%       |
| **Sprint 4.5** | Audit Frontend                      | ✅ Завершён | 100%       |
| **Sprint 4.7** | Email Verification                  | ✅ Завершён | 100%       |
| **Sprint 5**   | Core Business Module: Rack          | ⚠️ Частично | 10%        |
| **Sprint 6**   | Battery Module                      | ⏳ Не начат | 0%         |
| **Sprint 7**   | Export / Revisions / Soft Delete    | ⏳ Не начат | 0%         |
| **Sprint 8**   | Завершение и деплой                 | ⏳ Не начат | 0%         |

---

## ✅ Выполненные задачи

### Backend (Sprint 1)

- [x] Инициализация Node.js + TypeScript проекта
- [x] Monorepo структура (client + server workspaces)
- [x] Настройка ESLint, Prettier, Vitest
- [x] Prisma schema (MongoDB) — User, Role
- [x] Модуль `users`:
  - [x] UserRepository (findById, update, setRefreshToken)
- [x] Модуль `auth`:
  - [x] Use-cases: RegisterUser, LoginUser, ResetPassword, VerifyEmail
  - [x] JwtService (accessToken, refreshToken)
  - [x] Auth middleware
  - [x] Auth controller (все маршруты /api/auth/\*)
- [x] Prisma singleton (prisma.client.ts)
- [x] Конфигурация (ENV, DB, JWT, CORS)
- [x] Server entry point + routes
- [x] tsx для ES modules

### Frontend (Sprint 2)

- [x] Настройка проекта (React + TypeScript + Vite)
- [x] Структура папок (components, hooks, pages, services, stores, types, utils)
- [x] Зависимости установлены (React, TanStack Query, Zustand, React Hook Form, Zod, Axios)
- [x] API client с interceptors
- [x] Auth service (login, register, logout, getCurrentUser, resetPassword)
- [x] Zustand auth store
- [x] Валидация форм (Zod + React Hook Form)
- [x] Страницы:
  - [x] `/login` — Вход
  - [x] `/register` — Регистрация
  - [x] `/profile` — Профиль
- [x] React Router
- [x] Стили для auth форм

### DevOps

- [x] `npm run dev` — запускает оба приложения одновременно
- [x] concurrently установлен

### Backend (Sprint 4)

- [x] Модуль `audit`:
  - [x] Prisma schema: AuditEvent (MongoDB)
  - [x] AuditEvent entity, AuditAction VO, AuditResource VO
  - [x] AuditRepository (CRUD, filters, pagination)
  - [x] Use-cases: LogAuditAction, GetAuditLogs
  - [x] AuditController (GET /api/audit, /my, /:id)
  - [x] Audit middleware (auto-logging)
- [x] Middleware `requireRole` для проверки ролей
- [x] Интеграция с auth:
  - [x] Логирование входа (успех/неудача/ошибка)
  - [x] IP адрес, user agent
  - [x] Метаданные (request/response)

### Frontend (Sprint 3.5)

- [x] Настройка дизайн-системы:
  - [x] Tailwind CSS v4
  - [x] shadcn/ui (16 компонентов)
  - [x] Storybook
  - [x] prettier-plugin-tailwindcss
- [x] UI-компоненты:
  - [x] Button, Input, Label, Select, Checkbox, RadioGroup
  - [x] Card, Table, Dialog, DropdownMenu
  - [x] Sonner, Skeleton, Spinner, Avatar, Badge, ScrollArea, Separator
- [x] Layout-компоненты:
  - [x] Header (логотип, темы, уведомления, профиль)
  - [x] Sidebar (навигация с разделами)
  - [x] AppLayout (адаптивный)
- [x] Роутинг:
  - [x] ProtectedRoute
  - [x] GuestRoute
- [x] Страницы:
  - [x] DashboardPage
  - [x] LoginPage (обновлена)
  - [x] RegisterPage (обновлена)

### Frontend (Sprint 4.5)

- [x] Types:
  - [x] AuditLog, AuditFilters, AuditStatus
  - [x] AuditAction, AuditResource
- [x] Services:
  - [x] audit.service.ts (getLogs, getMyLogs, getLogById)
- [x] Components:
  - [x] AuditLogFilters (фильтры по статусу, ресурсу, действию, датам)
  - [x] AuditLogTable (таблица с badges)
  - [x] AuditLogDetail (modal с деталями)
- [x] Pages:
  - [x] AuditPage (/admin/audit)
- [x] Routes:
  - [x] /admin/audit (ADMIN only)
  - [x] Sidebar link updated

### Документация

- [x] RACK_ALGORITHM_BUSINESS.md — бизнес-алгоритм расчёта стеллажей
- [x] PLAN.md — **объединённый план разработки** (server + client)
- [x] summory.md — техническое резюме
- [x] backend-sturcure.md — структура бэкенда
- [x] STATUS.md — статус проекта

---

## ⚠️ Технические долги

| Проблема               | Приоритет  | Описание                                     |
| ---------------------- | ---------- | -------------------------------------------- |
| **Отсутствие тестов**  | 🔴 Высокий | Unit и integration тесты не созданы          |
| **Email verification** | 🟡 Средний | Use-case есть, отправка email не реализована |
| **Rack domain logic**  | 🟡 Средний | Структура есть, алгоритм не реализован       |

---

## 🚀 Следующие шаги

### Краткосрочные (1-2 недели)

1. **Sprint 5: Rack Module (Backend)**
   - Реализовать domain-функцию `calculateRack()` по алгоритму из `RACK_ALGORITHM_BUSINESS.md`
   - Создать Value Objects (Size, Rows, Weight)
   - Создать RackEntity
   - Реализовать RackRepository
   - Создать Use-case `calculateRackUseCase`
   - Создать RackController + маршруты `/api/rack/calculate`

2. **Sprint 5: Rack Module (Frontend)**
   - Страница калькулятора стеллажей `/rack/calculator`
   - Форма ввода параметров
   - Отображение результатов
   - Сохранение конфигураций (RackSet)

### Среднесрочные (3-4 недели)

3. **Sprint 6: Battery Module**
   - Domain-логика подбора батарей
   - UI для расчёта

4. **Тестирование**
   - Покрыть unit-тестами use-cases (auth, rack, rbac, audit)
   - Integration тесты для API endpoints

---

## 📦 Структура модулей (реализовано / требуется)

### Backend модули

| Модуль      | Domain | Application | Infrastructure | Interfaces | Статус      |
| ----------- | ------ | ----------- | -------------- | ---------- | ----------- |
| **auth**    | —      | ✅          | ✅             | ✅         | ✅ Завершён |
| **users**   | ✅     | —           | ✅             | —          | ✅ Завершён |
| **roles**   | ✅     | ✅          | ✅             | ✅         | ✅ Завершён |
| **perms**   | ✅     | —           | ✅             | ✅         | ✅ Завершён |
| **rack**    | ⚠️     | ⚠️          | ⚠️             | ⚠️         | ⚠️ Частично |
| **battery** | —      | —           | —              | —          | 🔴 Не начат |
| **audit**   | —      | —           | —              | —          | 🔴 Не начат |

### Frontend структура

| Компонент               | Статус            | Описание                            |
| ----------------------- | ----------------- | ----------------------------------- |
| **components/ui/**      | ✅ 16 компонентов | shadcn/ui компоненты                |
| **components/layout/**  | ✅                | Header, Sidebar, AppLayout          |
| **components/routing/** | ✅                | ProtectedRoute, GuestRoute          |
| **hooks/**              | 🔴 Пусто          | Кастомные хуки                      |
| **pages/**              | ✅ 4 страницы     | Dashboard, Login, Register, Profile |
| **services/**           | ✅ Auth           | API client, auth service            |
| **stores/**             | ✅ Auth           | Zustand auth store                  |
| **types/**              | 🔴 Пусто          | TypeScript типы                     |
| **utils/**              | ✅ Validation     | Zod схемы                           |

---

## 🛠️ Технологии

### Backend

- Node.js + TypeScript
- Express 5.x
- Prisma 5.x (MongoDB)
- Zod (валидация)
- JWT (jsonwebtoken)
- mongodb (ObjectId)
- Vitest (тесты)
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

## 📈 Метрики прогресса

```
Backend:  ████████████████░░░░░░ 50%
Frontend: █████████░░░░░░░░░░░░░ 25%
Tests:    ░░░░░░░░░░░░░░░░░░░░░░  0%
Docs:     ██████████████████████ 100%
```

---

## 🔗 Ресурсы

- **Репозиторий:** https://github.com/VladimirSt13/rack-calculator-v2
- **План разработки:** [PLAN.md](./PLAN.md)
- **Алгоритм:** [RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md)
- **Структура бэкенда:** [backend-sturcure.md](./backend-sturcure.md)
- **Техническое резюме:** [summory.md](./summory.md)
