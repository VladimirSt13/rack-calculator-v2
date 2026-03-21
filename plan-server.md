# 🗂️ План разработки сервера

> **Статус проекта:** Sprint 3 (RBAC) — ✅ Завершён
> **Последнее обновление:** 21 марта 2026 г.
> **Git статус:** feature/sprint3-rbac, Sprint 3 завершён, ожидает мержа в main

---

## **Sprint 0 — Подготовка проекта**

**Статус:** ✅ **ЗАВЕРШЁН**

**Выполненные задачи:**

1. ✅ Инициализация Node.js + TypeScript проекта
2. ✅ Установка зависимостей:
   - Backend: Express, Prisma (MongoDB), Zod
   - Dev: ESLint, Prettier, Vitest, tsx
3. ✅ Настройка линтинга и форматирования
4. ✅ Настройка структуры проекта (модули + слои)
5. ✅ Настройка тестов (Vitest конфиг)
6. ✅ Настройка конфигов: ENV, DB, JWT

**Результат:** рабочий skeleton проекта, готовый к добавлению модулей

---

## **Sprint 1 — User Management & Auth**

**Статус:** ✅ **ЗАВЕРШЁН** (в main)

**Выполненные задачи:**

1. ✅ Модуль `users`:
   - Entity: User (Prisma schema)
   - Repository: UserRepository
   - Методы: findById, update, setRefreshToken, setRoleId

2. ✅ Use-cases:
   - `registerUser` — регистрация
   - `loginUser` — JWT + refresh tokens
   - `resetPassword` (RequestResetPasswordUseCase, ResetPasswordUseCase)
   - `verifyEmail` — use-case создан

3. ✅ Controller: AuthController (createAuthRouter)
4. ✅ Маршруты API:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `POST /api/auth/reset-password/request`
   - `POST /api/auth/reset-password/confirm`
   - `POST /api/auth/refresh`
   - `POST /api/auth/logout`
   - `GET /api/auth/me`
5. ✅ JWT Service: JwtService (generateAccessToken, generateRefreshToken, verifyRefreshToken, roleId в токене)
6. ✅ Auth Middleware: authMiddleware
7. ✅ Prisma singleton (prisma.client.ts)

**Недостающие элементы:**

- ⚠️ Unit-тесты: domain и use-cases (не созданы)
- ⚠️ Integration-тесты: маршруты + use-cases (не созданы)
- ⚠️ Email verification — только use-case, без реализации отправки email

**Результат:** пользователи могут регистрироваться, логиниться, сбрасывать пароль, JWT работает

---

## **Sprint 2 — Frontend Auth Pages**

**Статус:** ✅ **ЗАВЕРШЁН** (в main)

**Выполненные задачи:**

1. ✅ API client с interceptors (auth, refresh)
2. ✅ Auth service (login, register, logout, getCurrentUser, resetPassword)
3. ✅ Zustand store для auth state
4. ✅ Валидация форм (Zod + React Hook Form)
5. ✅ Страницы:
   - `/login` — вход
   - `/register` — регистрация
   - `/profile` — профиль пользователя
6. ✅ React Router + TanStack Query
7. ✅ Стили для auth форм

**Результат:** полный цикл аутентификации работает (frontend + backend)

---

## **Sprint 3 — Roles & RBAC**

**Статус:** ✅ **ЗАВЕРШЁН** (в feature/sprint3-rbac)

**Выполненные задачи:**

1. ✅ Prisma schema: Role, Permission
2. ✅ Модуль `roles`:
   - Entity: Role
   - Repository: RoleRepository (CRUD + add/remove permissions)
   - Use-cases: CheckPermissionUseCase, AssignRoleToUserUseCase
   - PolicyService (canById, canAny, canAll)
   - Controller: RolesController
3. ✅ Модуль `permissions`:
   - Entity: Permission
   - Value Object: PermissionIdentifier
   - Repository: PermissionRepository (CRUD + findByResource)
   - Controller: PermissionsController
4. ✅ RBAC Middleware:
   - `requirePermission(resource, action)`
   - `requireAnyPermission([...])`
   - `requireRole(roleName)`
5. ✅ Интеграция с User:
   - User entity обновлён (roleId)
   - JWT токены включают roleId

**API Endpoints:**

- `GET/POST /api/roles`
- `GET/PUT/DELETE /api/roles/:id`
- `POST/DELETE /api/roles/:id/permissions`
- `GET/POST /api/permissions`
- `GET/PUT/DELETE /api/permissions/:id`
- `GET /api/permissions/resource/:resource`

**Результат:** система ролей и прав доступа готова к использованию

---

## **Sprint 4 — Audit / Logging**

**Статус:** ⏳ **НЕ НАЧАТ**

**Задачи:**

1. Модуль `roles`:
   - Entity: Role, Permission
   - Repository: RoleRepository

2. Policy layer:
   - `can(user, action, resource)`
   - Use-case: `checkPermission`

3. Интеграция с Users:
   - Assign role to user
   - Middleware для проверки прав на маршрутах

4. Unit-тесты: domain + use-cases
5. Integration-тесты: middleware + routes

**Результат:** права пользователей работают на уровне use-case, легко расширять для новых модулей

---

## **Sprint 4 — Audit / Logging**

**Статус:** ⏳ **НЕ НАЧАТ**

**Задачи:**

1. Модуль `audit`:
   - Entity: AuditEvent
   - Repository: AuditRepository
   - Use-case: `logAction`

2. Middleware для автоматического логирования действий:
   - login, create/update/delete

3. Асинхронная запись событий
4. Unit-тесты и интеграционные тесты

**Результат:** все критичные действия пользователей и системы логируются, готово для контроля и отладки

---

## **Sprint 5 — Core Business Module: Rack**

**Статус:** ⚠️ **ЧАСТИЧНО НАЧАТ** (создана структура модуля, без реализации)

**Выполнено:**

- ✅ Создана структура модуля `rack/`:
  - `domain/entities/` — пусто
  - `domain/value-objects/` — пусто
  - `application/` — пусто
  - `infrastructure/` — пусто
  - `interfaces/` — пусто

**Задачи:**

1. Модуль `rack`:
   - Entity: RackComponent
   - Value Objects: Size, Rows, Weight
   - Repository: RackRepository

2. Domain function: `calculateRack` (алгоритм в `RACK_ALGORITHM_BUSINESS.md`)
3. Use-case: `calculateRackUseCase`
4. Controller: `RackController`
5. Integration с RBAC и Audit
6. Unit-тесты domain + use-case
7. Integration-тесты controller + routes

**Результат:** расчёт стеллажей работает, использует ядро auth + RBAC + audit

---

## **Sprint 6 — Battery Module (производная от Rack)**

**Статус:** ⏳ **НЕ НАЧАТ**

**Примечание:** модуль `battery` существует в структуре (`server/src/modules/battery/`), но без реализации

**Задачи:**

1. Модуль `battery`:
   - Entity: BatteryComponent
   - Domain: `calculateBatteryFit`
   - Use-case: `calculateBatteryUseCase`
   - Repository: BatteryRepository

2. Интеграция с Rack:
   - Проверка совместимости батарей со стеллажами

3. Контроллер и маршруты: `/battery/calculate`
4. Unit и integration тесты

**Результат:** подбор батарей для стеллажей работает, полностью использует ядро системы

---

## **Sprint 7 — Export / Revisions / Soft Delete**

**Статус:** ⏳ **НЕ НАЧАТ**

**Задачи:**

1. Export:
   - Use-case: `exportRackSet` (Excel / PDF)

2. Revisions:
   - Сохранять версии RackSet
   - Soft delete / restore

3. Интеграция с Audit
4. Unit и integration тесты

**Результат:** пользователи могут сохранять комплекты, восстанавливать и экспортировать, действия логируются

---

## **Sprint 8 — Завершение и деплой**

**Статус:** ⏳ **НЕ НАЧАТ**

**Задачи:**

1. Настройка Docker и docker-compose
2. CI/CD для сборки, тестов, деплоя
3. Настройка окружений (dev/staging/prod)
4. Документация API (OpenAPI / Swagger)
5. Финальное тестирование

**Результат:** готовый сервер с ядром безопасности, бизнес-фичами и экспортом для MVP

---

## 📊 Сводная таблица статусов

| Спринт   | Название                         | Статус      | Примечание                            |
| -------- | -------------------------------- | ----------- | ------------------------------------- |
| Sprint 0 | Подготовка проекта               | ✅ Завершён | Настроено всё необходимое             |
| Sprint 1 | User Management & Auth           | ✅ Завершён | Без тестов и email-верификации        |
| Sprint 2 | Frontend Auth Pages              | ✅ Завершён | В main                                |
| Sprint 3 | Roles & RBAC                     | ✅ Завершён | В feature/sprint3-rbac, ожидает мержа |
| Sprint 4 | Audit / Logging                  | ⏳ Не начат | —                                     |
| Sprint 5 | Core Business Module: Rack       | ⚠️ Частично | Только структура модуля               |
| Sprint 6 | Battery Module                   | ⏳ Не начат | —                                     |
| Sprint 7 | Export / Revisions / Soft Delete | ⏳ Не начат | —                                     |
| Sprint 8 | Завершение и деплой              | ⏳ Не начат | —                                     |

---

## 🚀 Следующие шаги (приоритеты)

1. **Sprint 5 (Rack)** — реализовать domain-логику расчёта стеллажей по алгоритму из `RACK_ALGORITHM_BUSINESS.md`
2. **Sprint 4 (Audit)** — добавить логирование действий пользователей
3. **Sprint 5 (Rack UI)** — создать интерфейс калькулятора стеллажей
4. **Тесты** — покрыть unit-тестами use-cases (auth, rbac)

---

✅ **Итоговая стратегия:**

- Сначала строим **ядро системы** (пользователи, роли, аудит)
- Потом добавляем **бизнес-модули** (rack → battery → export → revisions)
- Каждый новый модуль сразу использует ядро auth/RBAC/audit
- Все слои разделены (domain, application, infrastructure, interfaces) → легко тестировать и масштабировать
