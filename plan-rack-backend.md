# 📦 Спринт 5: Модуль Rack (Backend) — План реалізації

> **Статус:** В роботі (Price Module ✅ завершено)  
> **Пріоритет:** Високий  
> **Оціночний час:** 1-2 тижні  
> **Алгоритм:** Див. `RACK_ALGORITHM_BUSINESS.md`

---

## 🎯 Мета

Реалізувати основну бізнес-фічу — модуль розрахунку стелажів з повним API для розрахунку компонентів стелажа та їх вартості.

---

## ✅ Виконані задачі

### Price Module (Завершено)

- [x] Prisma schema: Price model
- [x] Price entity з PriceData interface
- [x] PriceRepository (CRUD)
- [x] PriceService (розрахунок вартості, фільтр за ролями)
- [x] PriceController + API endpoints
- [x] Seed script для тестових даних
- [x] Інтеграція з routes.ts

**Структура даних Price:**

```json
{
  "supports": {
    "430": {
      "edge": { "code": "430", "price": 930 },
      "intermediate": { "code": "430", "price": 980 }
    }
  },
  "spans": { "600": { "code": "600", "price": 500 } },
  "vertical_supports": { "1190": { "code": "1190", "price": 1150 } },
  "diagonal_brace": { "code": "diagonal_brace", "price": 380 },
  "isolator": { "code": "isolator", "price": 69 }
}
```

**API Endpoints:**

```
GET    /api/prices                 # Список всіх прайсів
GET    /api/prices/:category       # Отримати прайс по категорії
POST   /api/prices                 # Створити (admin)
PUT    /api/prices/:id             # Оновити (admin)
POST   /api/prices/:id/activate    # Активувати (admin)
POST   /api/prices/:id/deactivate  # Деактивувати (admin)
DELETE /api/prices/:id             # Видалити (admin)
```

---

## 📋 Задачі, що залишилися

### 1. Domain Layer (Доменний шар)

#### Value Objects (Об'єкти-значення)

- [ ] `Size.vo.ts` — розміри (довжина, ширина, висота)
- [ ] `Rows.vo.ts` — кількість рядів
- [ ] `Weight.vo.ts` — вантажопідйомність

#### Entities (Сутності)

- [ ] `RackComponent.entity.ts` — компонент стелажа
  - Властивості: levels, rows, beamsPerRow, supportType, uprightType, spans
  - Методи: `calculateComponents()`, `getName()`, `getTotalLength()`

#### Domain Services (Доменні сервіси)

- [ ] `calculateRack.domain.ts` — чиста бізнес-логіка розрахунку
  - Вхід: RackConfig (levels, rows, beamsPerRow, supports, uprights, spans)
  - Вихід: RackCalculationResult (components, name, totalLength)
  - Правила:
    - Опори: крайні (2 × рівні) + проміжні ((прольоти - 1) × рівні)
    - Балки: кількість прольотів × ряди × балок/ряд × рівні
    - Вертикальні стійки: (прольоти + 1) × 2 (тільки 2+ рівні)
    - Розкоси: (прольоти - 1) × 2 + 2 (тільки 2+ рівні)
    - Ізолятори: (2 + прольоти - 1) × 2 (тільки 1 рівень)

---

### 2. Application Layer (Шар додатку)

#### Use-Cases (Варіанти використання)

- [ ] `calculateRack.use-case.ts`
  - Вхід: `CalculateRackInput` (валідація через Zod)
  - Вихід: `CalculateRackOutput` (components, cost, name)
  - Кроки:
    1. Валідація вхідних даних
    2. Виклик доменної функції `calculateRack()`
    3. **Інтеграція з PriceService** — отримати ціни
    4. Розрахунок вартості (base, withoutIsolators, retail)
    5. Фільтр цін за роллю користувача
    6. Повернення результату

- [ ] `createRackSet.use-case.ts`
  - Вхід: `CreateRackSetInput` (userId, calculationResult)
  - Вихід: `CreateRackSetOutput` (rackSetId, revisionId)
  - Кроки:
    1. Валідація існування користувача
    2. Створення сутності RackSet
    3. Створення початкової ревізії (Revision)
    4. Збереження та повернення ID

- [ ] `getRackSet.use-case.ts`
  - Вхід: `GetRackSetInput` (rackSetId, userId)
  - Вихід: `GetRackSetOutput` (RackSet з ревізіями)

- [ ] `listRackSets.use-case.ts`
  - Вхід: `ListRackSetsInput` (userId, pagination, filters)
  - Вихід: `ListRackSetsOutput` (RackSet[], total, pagination)

---

### 3. Infrastructure Layer (Інфраструктурний шар)

#### Repositories (Репозиторії)

- [ ] `RackRepository.ts`
  - Методи: `create()`, `findById()`, `findByUserId()`, `update()`, `softDelete()`

- [ ] `RackSetRepository.ts`
  - Методи: `create()`, `findById()`, `findByUserId()`, `addRevision()`

#### Price Service (Сервіс цін) ✅

**Завершено!**

- [x] `PriceService.ts`
  - Методи:
    - `getComponentPrice(category: string, key: string): number`
    - `calculateRackCost(components): RackPrices`
    - `calculateTotal(prices): TotalCost`
    - `getPricesByRole(total, userRole): PriceDisplay[]`
  - Інтеграція з Price DB через Prisma
  - **Кешування:** Завантажувати прайс один раз при старті

- [x] `PriceRepository.ts`
  - Методи: `findActiveByCategory()`, `findById()`, `create()`, `update()`

---

### 4. Interfaces Layer (Шар інтерфейсів)

#### Controllers (Контролери)

- [ ] `RackController.ts`
  - `POST /api/rack/calculate` — розрахувати стелаж
  - `GET /api/rack/calculate/:id` — отримати розрахунок по ID
  - `POST /api/rack/sets` — зберегти комплект
  - `GET /api/rack/sets` — список комплектів користувача
  - `GET /api/rack/sets/:id` — отримати комплект з ревізіями
  - `PUT /api/rack/sets/:id` — оновити комплект
  - `DELETE /api/rack/sets/:id` — м'яке видалення

- [x] `PricesController.ts` ✅ — див. вище

#### DTOs & Validators (DTO та валідатори)

- [ ] `calculate-rack.dto.ts` — Zod схема для input
- [ ] `rack-response.dto.ts` — формат відповіді

#### Middleware (Мідлвари)

- [ ] Застосувати `authMiddleware` до всіх маршрутів
- [ ] Застосувати `requirePermission('rack', 'create')` для calculate
- [ ] Застосувати перевірку володіння для rack sets операцій

---

## 🔄 Потік даних (Data Flow)

### Розрахунок стелажа

```
1. Клієнт заповнює форму (levels, rows, spans, supportType)
   ↓
2. POST /api/rack/calculate → RackController
   ↓
3. AuthMiddleware → перевірка токена
   ↓
4. CheckPermission('rack', 'create') → RBAC
   ↓
5. calculateRack.use-case.ts
   ↓
6. calculateRack.domain.ts → чиста логіка розрахунку
   ↓
7. **PriceService.calculateRackCost()** → отримати ціни компонентів
   ↓
8. **PriceService.calculateTotal()** → розрахувати вартість
   ↓
9. **PriceService.getPricesByRole()** → фільтр цін за роллю
   ↓
10. Відповідь клієнту: {components, prices, name}
```

### Збереження комплекту

```
1. Клієнт натискає "Зберегти комплект"
   ↓
2. POST /api/rack/sets → RackController
   ↓
3. AuthMiddleware → перевірка токена
   ↓
4. CheckPermission('rack', 'create')
   ↓
5. createRackSet.use-case.ts
   ↓
6. RackSetRepository.create() → новий комплект
   ↓
7. RackSetRepository.addRevision() → перша версія
   ↓
8. Відповідь: {rackSetId, revisionId}
```

### Отримання списку комплектів

```
1. Клієнт переходить на /my-sets
   ↓
2. GET /api/rack/sets → RackController
   ↓
3. AuthMiddleware → перевірка токена
   ↓
4. CheckPermission('rack', 'read')
   ↓
5. listRackSets.use-case.ts
   ↓
6. RackSetRepository.findByUserId() → список комплектів
   ↓
7. Для кожного комплекту:
   - Отримати останню ревізію
   - **Розрахувати актуальні ціни (PriceService)**
   ↓
8. Відповідь: {items[], pagination}
```

---

## 📡 Специфікація API

### Розрахунок стелажа

**Endpoint:** `POST /api/rack/calculate`

**Заголовки:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Тіло запиту:**

```json
{
  "levels": 2,
  "rows": 2,
  "beamsPerRow": 2,
  "supportType": "430",
  "uprightType": "1190",
  "spans": [
    { "length": 600, "quantity": 2 },
    { "length": 750, "quantity": 1 }
  ]
}
```

**Відповідь (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "calc_abc123",
    "name": "Стелаж двоповерховий дворядний L2A2-1950/430",
    "totalLength": 1950,
    "components": {
      "supports": {
        "edge": { "quantity": 4, "type": "430" },
        "intermediate": { "quantity": 4, "type": "430" }
      },
      "beams": [
        { "length": 600, "quantity": 16 },
        { "length": 750, "quantity": 8 }
      ],
      "uprights": { "quantity": 8, "type": "1190" },
      "braces": { "quantity": 6 },
      "isolators": null
    },
    "prices": {
      "componentPrices": {
        "supports": [
          { "name": "Опора 430 (крайня)", "amount": 4, "price": 930, "total": 3720 },
          { "name": "Опора 430 (пром)", "amount": 4, "price": 980, "total": 3920 }
        ],
        "beams": [
          { "name": "Балка 600", "amount": 16, "price": 500, "total": 8000 },
          { "name": "Балка 750", "amount": 8, "price": 630, "total": 5040 }
        ],
        "uprights": [{ "name": "Вертикальна стійка 1190", "amount": 8, "price": 1150, "total": 9200 }],
        "braces": [{ "name": "Розкос", "amount": 6, "price": 380, "total": 2280 }]
      },
      "total": {
        "base": 32160,
        "withoutIsolators": 32160,
        "retail": 46310
      },
      "displayPrices": [
        { "type": "base", "label": "Базова ціна", "value": 32160 },
        { "type": "withoutIsolators", "label": "Без ізоляторів", "value": 32160 },
        { "type": "retail", "label": "Нульова ціна", "value": 46310 }
      ]
    }
  }
}
```

---

## 🗄️ Схема бази даних

### Нові моделі (Prisma)

```prisma
model RackSet {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id])
  name        String
  description String?
  isDeleted   Boolean  @default(false)
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  revisions   RackRevision[]

  @@map("rack_sets")
}

model RackRevision {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  rackSetId    String   @db.ObjectId
  rackSet      RackSet  @relation(fields: [rackSetId], references: [id], onDelete: Cascade)
  version      Int
  config       Json     // RackConfig (levels, rows, spans, etc.)
  components   Json     // Calculated components
  totalLength  Int      // mm
  totalPrice   Float?   // Опціонально
  createdAt    DateTime @default(now())

  @@map("rack_revisions")
}
```

---

## ✅ Критерії приймання

- [ ] Алгоритм точно відповідає `RACK_ALGORITHM_BUSINESS.md`
- [ ] Всі API endpoints повертають коректні відповіді
- [ ] RBAC permissions застосовані до всіх endpoints
- [ ] Користувач може доступати тільки свої комплекти
- [ ] Реалізовано м'яке видалення (soft delete) для комплектів
- [ ] Ревізії створюються при кожному оновленні
- [ ] **PriceService інтегрований для розрахунку вартості**
- [ ] Unit-тести проходять (>80% покриття)
- [ ] Integration-тести проходять
- [ ] TypeScript компиляція проходить без помилок
- [ ] Немає помилок або попереджень в консолі

---

## 🔗 Пов'язані файли

- `RACK_ALGORITHM_BUSINESS.md` — бізнес-алгоритм розрахунку
- `plan-server.md` — загальний план сервера
- `price/PRICE_DB_STRUCTURE.md` — структура бази цін
- **`server/src/modules/price/`** — готовий модуль цін

---

## 📝 Примітки

- Почати з domain-логіки (чисті функції, без залежностей)
- Потім реалізувати use-cases
- Потім репозиторії та контролери
- RBAC middleware додати в кінці
- **PriceService вже готовий — використовувати для розрахунку вартості**
- Писати тести по ходу розробки
