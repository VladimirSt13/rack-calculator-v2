# 📊 Статус проекта Rack Calculator V2

> **Дата обновления:** 20 марта 2026 г.  
> **Ветка:** `main`  
> **Последний коммит:** `cb65ef9` — feat: add monorepo structure и implement Sprint 1 (Auth & Users)

---

## 🎯 Общее состояние

| Компонент | Статус | Готовность |
|-----------|--------|------------|
| **Backend** | 🟡 В разработке | ~25% |
| **Frontend** | 🔴 Не начат | ~5% |
| **База данных** | 🟡 Настроена (Prisma + MongoDB) | Schema готова |
| **Тесты** | 🔴 Отсутствуют | 0% |
| **Документация** | 🟢 Актуальна | ✅ |

---

## 📅 Спринты

| Спринт | Название | Статус | completion |
|--------|----------|--------|------------|
| **Sprint 0** | Подготовка проекта | ✅ Завершён | 100% |
| **Sprint 1** | User Management & Auth | ✅ Завершён | 100% |
| **Sprint 2** | Roles & RBAC | ⏳ Не начат | 0% |
| **Sprint 3** | Audit / Logging | ⏳ Не начат | 0% |
| **Sprint 4** | Core Business Module: Rack | ⚠️ Частично | 10% |
| **Sprint 5** | Battery Module | ⏳ Не начат | 0% |
| **Sprint 6** | Export / Revisions / Soft Delete | ⏳ Не начат | 0% |
| **Sprint 7** | Завершение и деплой | ⏳ Не начат | 0% |

---

## ✅ Выполненные задачи

### Backend

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
  - [x] Auth controller (все маршруты /api/auth/*)
- [x] Конфигурация (ENV, DB, JWT, CORS)
- [x] Server entry point + routes

### Frontend

- [x] Настройка проекта (React + TypeScript + Vite)
- [x] Структура папок (components, hooks, pages, services, stores, types, utils)
- [x] Зависимости установлены (React, TanStack Query, Zustand, React Hook Form, Zod, Axios)

### Документация

- [x] RACK_ALGORITHM_BUSINESS.md — бизнес-алгоритм расчёта стеллажей
- [x] plan-server.md — план разработки сервера
- [x] plan-client.md — план разработки клиента
- [x] summory.md — техническое резюме
- [x] backend-sturcure.md — структура бэкенда

---

## ⚠️ Технические долги

| Проблема | Приоритет | Описание |
|----------|-----------|----------|
| **Отсутствие тестов** | 🔴 Высокий | Unit и integration тесты не созданы |
| **Email verification** | 🟡 Средний | Use-case есть, отправка email не реализована |
| **RBAC middleware** | 🟡 Средний | Требуется для защиты маршрутов |
| **Audit logging** | 🟡 Средний | Логирование действий не реализовано |
| **Rack domain logic** | 🟡 Средний | Структура есть, алгоритм не реализован |

---

## 🚀 Следующие шаги

### Краткосрочные (1-2 недели)

1. **Sprint 4: Rack Module (Backend)**
   - Реализовать domain-функцию `calculateRack()` по алгоритму из `RACK_ALGORITHM_BUSINESS.md`
   - Создать Value Objects (Size, Rows, Weight)
   - Создать RackEntity
   - Реализовать RackRepository
   - Создать Use-case `calculateRackUseCase`
   - Создать RackController + маршруты

2. **Sprint 2: Frontend Auth Pages**
   - Настроить React Router
   - Создать страницу `/login`
   - Создать страницу `/register`
   - Создать страницу `/profile`
   - Настроить Auth store (Zustand)
   - Интегрировать с API через TanStack Query

3. **Sprint 2: RBAC (Backend)**
   - Создать модуль `roles` (Role, Permission entities)
   - Реализовать Policy layer (`can` function)
   - Добавить middleware для проверки прав

### Среднесрочные (3-4 недели)

4. **Sprint 3: Audit Logging**
   - Создать модуль `audit` (AuditEvent entity)
   - Реализовать Audit middleware
   - Логирование действий пользователей

5. **Sprint 4: Rack UI**
   - Страница калькулятора стеллажей
   - Форма ввода параметров
   - Отображение результатов
   - Сохранение конфигураций (RackSet)

6. **Тестирование**
   - Покрыть unit-тестами use-cases (auth, rack)
   - Integration тесты для API endpoints

---

## 📦 Структура модулей (реализовано / требуется)

### Backend модули

| Модуль | Domain | Application | Infrastructure | Interfaces | Статус |
|--------|--------|-------------|----------------|------------|--------|
| **auth** | — | ✅ | ✅ | ✅ | ✅ Завершён |
| **users** | ✅ | — | ✅ | — | ✅ Завершён |
| **rack** | ⚠️ (пусто) | ⚠️ (пусто) | ⚠️ (пусто) | ⚠️ (пусто) | ⚠️ Частично |
| **battery** | — | — | — | — | 🔴 Не начат |
| **roles** | — | — | — | — | 🔴 Не начат |
| **audit** | — | — | — | — | 🔴 Не начат |

### Frontend структура

| Компонент | Статус | Описание |
|-----------|--------|----------|
| **components/** | 🔴 Пусто | UI компоненты |
| **hooks/** | 🔴 Пусто | Кастомные хуки |
| **pages/** | 🔴 Пусто | Страницы приложения |
| **services/** | 🔴 Пусто | API client (axios) |
| **stores/** | 🔴 Пусто | Zustand stores (auth, ui) |
| **types/** | 🔴 Пусто | TypeScript типы |
| **utils/** | 🔴 Пусто | Утилиты |

---

## 🛠️ Технологии

### Backend
- Node.js + TypeScript
- Express 5.x
- Prisma (MongoDB)
- Zod (валидация)
- JWT (jsonwebtoken)
- Vitest (тесты)

### Frontend
- React 19
- TypeScript
- Vite
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios

---

## 📈 Метрики прогресса

```
Backend:  ████████░░░░░░░░░░░░ 25%
Frontend: ████░░░░░░░░░░░░░░░░  5%
Tests:    ░░░░░░░░░░░░░░░░░░░░  0%
Docs:     ████████████████████ 100%
```

---

## 🔗 Ресурсы

- **Репозиторий:** https://github.com/VladimirSt13/rack-calculator-v2
- **План сервера:** [plan-server.md](./plan-server.md)
- **План клиента:** [plan-client.md](./plan-client.md)
- **Общий план:** [план.md](./план.md)
- **Алгоритм:** [RACK_ALGORITHM_BUSINESS.md](./RACK_ALGORITHM_BUSINESS.md)
