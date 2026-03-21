# 📊 Статус проекта Rack Calculator V2

> **Дата обновления:** 21 марта 2026 г.  
> **Ветка:** `feature/sprint3-rbac` (Sprint 3 завершён, ожидает мержа)  
> **Последний коммит:** `277391f` — feat(server): Sprint 3 - RBAC

---

## 🎯 Общее состояние

| Компонент        | Статус                          | Готовность |
| ---------------- | ------------------------------- | ---------- |
| **Backend**      | 🟢 Готово (Sprint 1-3)          | ~40%       |
| **Frontend**     | 🟢 Готово (Sprint 2)            | ~15%       |
| **База данных**  | 🟢 Настроена (Prisma + MongoDB) | ✅         |
| **Тесты**        | 🔴 Отсутствуют                  | 0%         |
| **Документация** | 🟢 Актуальна                    | ✅         |

---

## 📅 Спринты

| Спринт       | Название                         | Статус      | Completion |
| ------------ | -------------------------------- | ----------- | ---------- |
| **Sprint 0** | Подготовка проекта               | ✅ Завершён | 100%       |
| **Sprint 1** | User Management & Auth           | ✅ Завершён | 100%       |
| **Sprint 2** | Frontend Auth Pages              | ✅ Завершён | 100%       |
| **Sprint 3** | Roles & RBAC                     | ✅ Завершён | 100%       |
| **Sprint 4** | Audit / Logging                  | ⏳ Не начат | 0%         |
| **Sprint 5** | Core Business Module: Rack       | ⚠️ Частично | 10%        |
| **Sprint 6** | Battery Module                   | ⏳ Не начат | 0%         |
| **Sprint 7** | Export / Revisions / Soft Delete | ⏳ Не начат | 0%         |
| **Sprint 8** | Завершение и деплой              | ⏳ Не начат | 0%         |

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

### Документация

- [x] RACK_ALGORITHM_BUSINESS.md — бизнес-алгоритм расчёта стеллажей
- [x] plan-server.md — план разработки сервера
- [x] plan-client.md — план разработки клиента
- [x] summory.md — техническое резюме
- [x] backend-sturcure.md — структура бэкенда
- [x] STATUS.md — статус проекта

---

## ⚠️ Технические долги

| Проблема               | Приоритет  | Описание                                     |
| ---------------------- | ---------- | -------------------------------------------- |
| **Отсутствие тестов**  | 🔴 Высокий | Unit и integration тесты не созданы          |
| **Email verification** | 🟡 Средний | Use-case есть, отправка email не реализована |
| **Audit logging**      | 🟡 Средний | Логирование действий не реализовано          |
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
   - Создать RackController + маршруты

2. **Sprint 5: Rack UI (Frontend)**
   - Страница калькулятора стеллажей
   - Форма ввода параметров
   - Отображение результатов
   - Сохранение конфигураций (RackSet)

3. **Sprint 4: Audit Logging**
   - Создать модуль `audit` (AuditEvent entity)
   - Реализовать Audit middleware
   - Логирование действий пользователей

### Среднесрочные (3-4 недели)

4. **Sprint 6: Battery Module**
   - Domain-логика подбора батарей
   - UI для расчёта

5. **Тестирование**
   - Покрыть unit-тестами use-cases (auth, rack, rbac)
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

| Компонент       | Статус        | Описание                 |
| --------------- | ------------- | ------------------------ |
| **components/** | 🔴 Пусто      | UI компоненты            |
| **hooks/**      | 🔴 Пусто      | Кастомные хуки           |
| **pages/**      | ✅ Auth       | Login, Register, Profile |
| **services/**   | ✅ Auth       | API client, auth service |
| **stores/**     | ✅ Auth       | Zustand auth store       |
| **types/**      | 🔴 Пусто      | TypeScript типы          |
| **utils/**      | ✅ Validation | Zod схемы                |

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
Backend:  ████████████░░░░░░░░░░ 25%
Frontend: ███████░░░░░░░░░░░░░░░ 15%
Tests:    ░░░░░░░░░░░░░░░░░░░░░░  0%
Docs:     ██████████████████████ 100%
```

---

## 🔗 Ресурсы

- **Репозиторий:** https://github.com/VladimirSt13/rack-calculator-v2
- **План сервера:** [plan-server.md](./plan-server.md)
- **План клиента:** [plan-client.md](./plan-client.md)
- **Общий план:** [план.md](./план.md)
- **Алгоритм:** [RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md)
