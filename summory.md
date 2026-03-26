Rack Calculator — Technical Summary (v4, Rebuild)
📌 Мета проєкту

Створити онлайн-сервіс для розрахунку стелажів і батарей з можливістю масштабування під нові фічі.
Фокус: бізнес-логіка в центрі, тестованість, модульність, контроль залежностей, готовність до розширення.

🧠 Основний принцип

Бізнес-логіка — ядро системи. API, база даних і UI — інфраструктура.
Кожен use-case — одна дія. Domain не залежить від фреймворків і зовнішніх сервісів.

1. Стек технологій

Frontend:

React 18 + TypeScript

Vite

React Router

TanStack Query (data fetching)

Zustand (UI і локальний стан)

TailwindCSS + Radix UI

React Hook Form + Zod (валідація форм)

Backend:

Node.js + TypeScript

Express або Fastify

MongoDB (Mongoose / Prisma)

Інше:

ESLint + Prettier

Vitest (unit і integration тести)

2. Принципи розробки

Use Case Driven — 1 дія = 1 use-case

Separation of Concerns — domain / application / infrastructure / interfaces

No Fat Services — немає god-object сервісів

Explicit Dependencies — залежності передаються явно

Domain First — логіка поза фреймворками

Garbage-Free Shared — без загальної свалки модулів

Composition over Inheritance — надаємо перевагу композиції

3. Архітектура

Тип: Modular Monolith + Clean Architecture

Шари
domain/ # чиста бізнес-логіка (без залежностей)
application/ # use-cases
infrastructure/# DB, API, email, JWT
interfaces/ # controllers / routes
Потік даних
HTTP → Controller → UseCase → Domain → Repository → DB

Domain не знає про DB / Express

Use-case оркеструє дії

Repository відповідає тільки за доступ до даних

Структура модулів
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
users/ 4. Основний функціонал (план)

Auth (JWT + Refresh)

Email verification, password reset

Users & roles management (RBAC)

Rack calculation

Battery calculation

Rack sets (збереження конфігурацій)

Revisions (версії)

Soft delete / restore

Export (Excel)

Audit log

Price management

Filtering + pagination

5. Алгоритми фіч (структурно)
   Авторизація

Use-case: loginUser

Знайти користувача

Перевірити пароль

Згенерувати access + refresh token

Зберегти refresh token

Повернути токени

Розрахунок стелажа

Domain: calculateRack()

Прийняти параметри

Підібрати конфігурацію

Розрахувати компоненти і вартість

Повернути результат

Use-case: calculateRack

Валідує вхід

Викликає domain функцію

Повертає результат

Підбір батарей

Domain: calculateBatteryFit()

Розрахувати потрібну довжину

Відфільтрувати конфігурації

Знайти оптимальні варіанти

Повернути список

Збереження комплекту

Use-case: createRackSet

Прийняти дані

Створити RackSet і Revision

Зберегти

Повернути результат

RBAC

Policy layer: can(user, action, resource)

Отримати permissions

Перевірити правило

Повернути true/false

Audit

Use-case: logAction

Прийняти контекст

Зберегти подію

(опціонально) асинхронна обробка

Export

Use-case: exportRackSet

Отримати дані

Сформувати структуру

Згенерувати файл

Повернути stream

6. Ключові зміни відносно старої версії

Прибрано:

BaseRepository

Жирні сервіси

Shared як «свалка»

Логіка в контролерах

Додано:

Domain шар (ядро)

Use-cases

Policy layer (RBAC)

Явні межі модулів

Покращено:

Тестованість (domain і use-case можна тестувати окремо)

Масштабованість

Читабельність і контроль залежностей

7. Головний принцип

👉 Бізнес-логіка — це ядро системи, а не побічний ефект Express + Mongo
