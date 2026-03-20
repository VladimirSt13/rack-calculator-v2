# 🗂️ План разработки сервера

## **Sprint 0 — Подготовка проекта**

**Цель:** создать каркас проекта, настроить инструменты разработки и CI/CD.

**Задачи:**

1. Инициализация Node.js + TypeScript проекта
2. Установка зависимостей:
   - Backend: Express/Fastify, MongoDB (Mongoose / Prisma), Zod
   - Dev: ESLint, Prettier, Vitest, ts-node-dev

3. Настройка линтинга и форматирования
4. Настройка структуры проекта (модули + слои)
5. Настройка тестов (unit + integration)
6. Настройка конфигов: ENV, DB, JWT

**Результат:** рабочий skeleton проекта, готовый к добавлению модулей

---

## **Sprint 1 — User Management & Auth**

**Цель:** создать базовый модуль пользователей и аутентификации

**Задачи:**

1. Модуль `users`:
   - Entity: User
   - Value Objects: Email, Password
   - Repository: UserRepository

2. Use-cases:
   - `registerUser`
   - `loginUser` (JWT + refresh tokens)
   - `resetPassword`
   - `verifyEmail`

3. Controller: UsersController
4. Маршруты API: `/auth/register`, `/auth/login`, `/auth/reset-password`
5. Unit-тесты: domain и use-cases
6. Integration-тесты: маршруты + use-cases

**Результат:** пользователи могут регистрироваться, логиниться, сбрасывать пароль, JWT работает

---

## **Sprint 2 — Roles & RBAC**

**Цель:** настроить систему ролей и прав

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

## **Sprint 3 — Audit / Logging**

**Цель:** фиксировать действия пользователей и системы

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

## **Sprint 4 — Core Business Module: Rack**

**Цель:** реализовать первую бизнес-фичу

**Задачи:**

1. Модуль `rack`:
   - Entity: RackComponent
   - Value Objects: Size, Rows, Weight
   - Repository: RackRepository

2. Domain function: `calculateRack`
3. Use-case: `calculateRackUseCase`
4. Controller: `RackController`
5. Integration с RBAC и Audit
6. Unit-тесты domain + use-case
7. Integration-тесты controller + routes

**Результат:** расчёт стеллажей работает, использует ядро auth + RBAC + audit

---

## **Sprint 5 — Battery Module (производная от Rack)**

**Цель:** добавить фичу батарей

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

## **Sprint 6 — Export / Revisions / Soft Delete**

**Цель:** добавить вспомогательные фичи

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

## **Sprint 7 — Завершение и деплой**

**Цель:** подготовить проект к продакшену

**Задачи:**

1. Настройка Docker и docker-compose
2. CI/CD для сборки, тестов, деплоя
3. Настройка окружений (dev/staging/prod)
4. Документация API (OpenAPI / Swagger)
5. Финальное тестирование

**Результат:** готовый сервер с ядром безопасности, бизнес-фичами и экспортом для MVP

---

✅ **Итоговая стратегия:**

- Сначала строим **ядро системы** (пользователи, роли, аудит)
- Потом добавляем **бизнес-модули** (rack → battery → export → revisions)
- Каждый новый модуль сразу использует ядро auth/RBAC/audit
- Все слои разделены (domain, application, infrastructure, interfaces) → легко тестировать и масштабировать


