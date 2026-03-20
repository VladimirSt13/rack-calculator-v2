Rack Calculator — Technical Summary (v4, Rebuild)
📌 Цель проекта

Создать онлайн-сервис для расчёта стеллажей и батарей с возможностью масштабирования под новые фичи.
Фокус: бизнес-логика в центре, тестируемость, модульность, контроль зависимостей, готовность к расширению.

🧠 Основной принцип

Бизнес-логика — ядро системы. API, база данных и UI — инфраструктура.
Каждый use-case — одно действие. Domain не зависит от фреймворков и внешних сервисов.

1. Стек технологий

Frontend:

React 18 + TypeScript

Vite

React Router

TanStack Query (data fetching)

Zustand (UI и локальное состояние)

TailwindCSS + Radix UI

React Hook Form + Zod (валидация форм)

Backend:

Node.js + TypeScript

Express или Fastify

MongoDB (Mongoose / Prisma)

Прочее:

ESLint + Prettier

Vitest (unit и integration тесты)

2. Принципы разработки

Use Case Driven — 1 действие = 1 use-case

Separation of Concerns — domain / application / infrastructure / interfaces

No Fat Services — нет god-object сервисов

Explicit Dependencies — зависимости передаются явно

Domain First — логика вне фреймворков

Garbage-Free Shared — без общей свалки модулей

Composition over Inheritance — предпочитаем композицию

3. Архитектура

Тип: Modular Monolith + Clean Architecture

Слои
domain/        # чистая бизнес-логика (без зависимостей)
application/   # use-cases
infrastructure/# DB, API, email, JWT
interfaces/    # controllers / routes
Поток данных
HTTP → Controller → UseCase → Domain → Repository → DB

Domain не знает про DB / Express

Use-case оркестрирует действия

Repository отвечает только за доступ к данным

Структура модулей
server/
  src/
    modules/
      rack/
        domain/
          rack.entity.ts
          calculateRack.ts
        application/
          calculateRack.use-case.ts
        infrastructure/
          rack.repository.ts
        interfaces/
          rack.controller.ts
      battery/
        domain/
          calculateBatteryFit.ts
        application/
          calculateBattery.use-case.ts
      auth/
      users/
4. Основной функционал (план)

Auth (JWT + Refresh)

Email verification, password reset

Users & roles management (RBAC)

Rack calculation

Battery calculation

Rack sets (сохранение конфигураций)

Revisions (версии)

Soft delete / restore

Export (Excel)

Audit log

Price management

Filtering + pagination

5. Алгоритмы фич (структурно)
Авторизация

Use-case: loginUser

Найти пользователя

Проверить пароль

Сгенерировать access + refresh token

Сохранить refresh token

Вернуть токены

Расчёт стелажа

Domain: calculateRack()

Принять параметры

Подобрать конфигурацию

Рассчитать компоненты и стоимость

Вернуть результат

Use-case: calculateRack

Валидирует вход

Вызывает domain функцию

Возвращает результат

Подбор батарей

Domain: calculateBatteryFit()

Рассчитать требуемую длину

Отфильтровать конфигурации

Найти оптимальные варианты

Вернуть список

Сохранение комплекта

Use-case: createRackSet

Принять данные

Создать RackSet и Revision

Сохранить

Вернуть результат

RBAC

Policy layer: can(user, action, resource)

Получить permissions

Проверить правило

Вернуть true/false

Audit

Use-case: logAction

Принять контекст

Сохранить событие

(опционально) асинхронная обработка

Export

Use-case: exportRackSet

Получить данные

Сформировать структуру

Сгенерировать файл

Вернуть stream

6. Ключевые изменения относительно старой версии

Убрано:

BaseRepository

Жирные сервисы

Shared как «свалка»

Логика в контроллерах

Добавлено:

Domain слой (ядро)

Use-cases

Policy layer (RBAC)

Явные границы модулей

Улучшено:

Тестируемость (domain и use-case можно тестировать отдельно)

Масштабируемость

Читаемость и контроль зависимостей

7. Главный принцип

👉 Бизнес-логика — это ядро системы, а не побочный эффект Express + Mongo