# 📦 Спринт 5: Модуль Rack (Backend) — План реализации

> **Статус:** Запланировано  
> **Приоритет:** Высокий  
> **Оценочное время:** 1-2 недели  
> **Алгоритм:** См. `RACK_ALGORITHM_BUSINESS.md`

---

## 🎯 Цель

Реализовать основную бизнес-фичу — модуль расчёта стеллажей с полным API для расчёта компонентов стеллажа и их стоимости.

---

## 📋 Задачи

### 1. Domain Layer (Доменный слой)

#### Value Objects (Объекты-значения)

- [ ] `Size.vo.ts` — размеры (длина, ширина, высота)
- [ ] `Rows.vo.ts` — количество рядов
- [ ] `Weight.vo.ts` — грузоподъёмность

#### Entities (Сущности)

- [ ] `RackComponent.entity.ts` — компонент стеллажа
  - Свойства: levels, rows, beamsPerRow, supportType, uprightType, spans
  - Методы: `calculateComponents()`, `getName()`, `getTotalLength()`

#### Domain Services (Доменные сервисы)

- [ ] `calculateRack.domain.ts` — чистая бизнес-логика расчёта
  - Вход: RackConfig (levels, rows, beamsPerRow, supports, uprights, spans)
  - Выход: RackCalculationResult (components, name, totalLength)
  - Правила:
    - Опоры: крайние (2 × уровни) + промежуточные ((прольоты - 1) × уровни)
    - Балки: количество прольотов × ряды × балок/ряд × уровни
    - Вертикальные стойки: (прольоты + 1) × 2 (только 2+ уровня)
    - Раскосы: (прольоты - 1) × 2 + 2 (только 2+ уровня)
    - Изоляторы: (2 + прольоты - 1) × 2 (только 1 уровень)

---

### 2. Application Layer (Слой приложения)

#### Use-Cases (Варианты использования)

- [ ] `calculateRack.use-case.ts`
  - Вход: `CalculateRackInput` (валидация через Zod)
  - Выход: `CalculateRackOutput` (components, cost, name)
  - Шаги:
    1. Валидация входных данных
    2. Вызов доменной функции `calculateRack()`
    3. Расчёт стоимости (опционально, если есть данные цен)
    4. Возврат результата

- [ ] `createRackSet.use-case.ts`
  - Вход: `CreateRackSetInput` (userId, calculationResult)
  - Выход: `CreateRackSetOutput` (rackSetId, revisionId)
  - Шаги:
    1. Валидация существования пользователя
    2. Создание сущности RackSet
    3. Создание начальной ревизии (Revision)
    4. Сохранение и возврат ID

- [ ] `getRackSet.use-case.ts`
  - Вход: `GetRackSetInput` (rackSetId, userId)
  - Выход: `GetRackSetOutput` (RackSet с ревизиями)

- [ ] `listRackSets.use-case.ts`
  - Вход: `ListRackSetsInput` (userId, pagination, filters)
  - Выход: `ListRackSetsOutput` (RackSet[], total, pagination)

---

### 3. Infrastructure Layer (Инфраструктурный слой)

#### Repositories (Репозитории)

- [ ] `RackRepository.ts`
  - Методы: `create()`, `findById()`, `findByUserId()`, `update()`, `softDelete()`

- [ ] `RackSetRepository.ts`
  - Методы: `create()`, `findById()`, `findByUserId()`, `addRevision()`

#### Price Service (Сервис цен)

**Увага:** Це критично важливий сервіс! Без нього не буде розрахунку вартості.

- [ ] `PriceService.ts`
  - Методи:
    - `getComponentPrice(type: string, subtype?: string): number` — отримати ціну компонента
    - `calculateTotal(components: RackComponents): TotalCost` — розрахувати загальну вартість
    - `getPricesByRole(total: number, userRole: UserRole): PriceDisplay[]` — ціни за роллю
  - Інтеграція з даними з папки `price/` або Price DB
  - **Кешування:** Завантажувати прайс один раз при старті сервера

- [ ] `PriceRepository.ts`
  - Методи: `getCurrentPriceList()`, `getPriceByType(type)`
  - Джерело: MongoDB або Excel файл з `price/`

#### Cost Calculation Logic

**Формули розрахунку:**

```typescript
// Базова ціна = сума всіх компонентів
basePrice = Σ(component.quantity × component.price)

// Без ізоляторів (для багатоповерхових)
withoutIsolators = basePrice - isolatorsCost

// Нульова ціна (для менеджерів)
retailPrice = basePrice × 1.44
```

**Відображення цін за роллю:**

```typescript
// Admin бачить всі ціни
adminPrices = [
  { type: 'base', label: 'Базова ціна', value: basePrice },
  { type: 'withoutIsolators', label: 'Без ізоляторів', value: withoutIsolators },
  { type: 'retail', label: 'Нульова ціна', value: retailPrice },
];

// Manager бачить тільки нульову
managerPrices = [{ type: 'retail', label: 'Нульова ціна', value: retailPrice }];

// User не бачить цін
userPrices = [];
```

---

### 4. Interfaces Layer (Слой интерфейсов)

#### Controllers (Контроллеры)

- [ ] `RackController.ts`
  - `POST /api/rack/calculate` — рассчитать стеллаж
  - `GET /api/rack/calculate/:id` — получить расчёт по ID
  - `POST /api/rack/sets` — сохранить комплект
  - `GET /api/rack/sets` — список комплектов пользователя
  - `GET /api/rack/sets/:id` — получить комплект с ревизиями
  - `PUT /api/rack/sets/:id` — обновить комплект
  - `DELETE /api/rack/sets/:id` — мягкое удаление

#### DTOs & Validators (DTO и валидаторы)

- [ ] `calculate-rack.dto.ts` — Zod схема для input
- [ ] `rack-response.dto.ts` — формат ответа

#### Middleware (Мидлвари)

- [ ] Применить `authMiddleware` ко всем маршрутам
- [ ] Применить `requirePermission('rack', 'create')` для calculate
- [ ] Применить проверку владения для операций с rack sets

---

## 🗄️ Схема базы данных

### Новые модели (Prisma)

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
  totalPrice   Float?   // Опционально
  createdAt    DateTime @default(now())

  @@map("rack_revisions")
}
```

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
7. PriceService.getPrices() → отримати ціни
   ↓
8. PriceService.calculateTotal() → розрахувати вартість
   ↓
9. PriceService.getByRole() → фільтр цін за роллю
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
   - Отримати останню ревизію
   - Розрахувати актуальні ціни (PriceService)
   ↓
8. Відповідь: {items[], pagination}
```

---

## 📡 Спецификация API

### Расчёт стеллажа

**Endpoint:** `POST /api/rack/calculate`

**Заголовки:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Тело запроса:**

```json
{
  "levels": 2,
  "rows": 2,
  "beamsPerRow": 2,
  "supportType": "C80",
  "uprightType": "1190",
  "spans": [
    { "length": 600, "quantity": 2 },
    { "length": 750, "quantity": 1 }
  ]
}
```

**Ответ (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "calc_abc123",
    "name": "Стелаж двоповерховий дворядний L2A2-1950/80",
    "totalLength": 1950,
    "components": {
      "supports": {
        "edge": { "quantity": 4, "type": "C80" },
        "intermediate": { "quantity": 4, "type": "C80" }
      },
      "beams": [
        { "length": 600, "quantity": 16 },
        { "length": 750, "quantity": 8 }
      ],
      "uprights": { "quantity": 8, "type": "1190" },
      "braces": { "quantity": 6 },
      "isolators": null
    },
    "costs": {
      "base": 32160,
      "withoutIsolators": 32160,
      "retail": 46310
    }
  }
}
```

---

### Сохранение комплекта стеллажей

**Endpoint:** `POST /api/rack/sets`

**Тело запроса:**

```json
{
  "name": "Склад стелаж #1",
  "description": "Основной стеллаж для склада",
  "calculationId": "calc_abc123"
}
```

**Ответ (201 Created):**

```json
{
  "success": true,
  "data": {
    "rackSetId": "set_xyz789",
    "revisionId": "rev_001",
    "version": 1
  }
}
```

---

### Получить комплекты стеллажей пользователя

**Endpoint:** `GET /api/rack/sets?page=1&limit=10`

**Ответ (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "set_xyz789",
        "name": "Склад стелаж #1",
        "revisionsCount": 3,
        "latestVersion": 3,
        "createdAt": "2026-03-20T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

## 🔐 Интеграция с RBAC

### Необходимые права доступа

| Endpoint                      | Permission    |
| ----------------------------- | ------------- |
| `POST /api/rack/calculate`    | `rack:create` |
| `GET /api/rack/calculate/:id` | `rack:read`   |
| `POST /api/rack/sets`         | `rack:create` |
| `GET /api/rack/sets`          | `rack:read`   |
| `GET /api/rack/sets/:id`      | `rack:read`   |
| `PUT /api/rack/sets/:id`      | `rack:update` |
| `DELETE /api/rack/sets/:id`   | `rack:delete` |

### Использование middleware

```typescript
router.post('/calculate', authMiddleware, requirePermission('rack', 'create'), calculateRackHandler);

router.get('/sets/:id', authMiddleware, requirePermission('rack', 'read'), checkOwnership, getRackSetHandler);
```

---

## 🧪 План тестирования

### Unit-тесты

- [ ] `calculateRack.domain.test.ts` — тестирование алгоритма расчёта
- [ ] `calculateRack.use-case.test.ts` — тестирование use-case
- [ ] `RackComponent.entity.test.ts` — тестирование entity

### Integration-тесты

- [ ] `rack.controller.test.ts` — тестирование API endpoints
- [ ] `rack-set.repository.test.ts` — тестирование repository

### Тестовые данные

```typescript
const testRackConfig = {
  levels: 2,
  rows: 2,
  beamsPerRow: 2,
  supportType: 'C80',
  uprightType: '1190',
  spans: [
    { length: 600, quantity: 2 },
    { length: 750, quantity: 1 },
  ],
};

const expectedComponents = {
  supports: { edge: 4, intermediate: 4 },
  beams: { 600: 16, 750: 8 },
  uprights: 8,
  braces: 6,
  isolators: null,
};
```

---

## 📁 Структура файлов

```
server/src/modules/rack/
├── domain/
│   ├── entities/
│   │   └── rack-component.entity.ts
│   ├── value-objects/
│   │   ├── size.vo.ts
│   │   ├── rows.vo.ts
│   │   └── weight.vo.ts
│   └── services/
│       └── calculateRack.domain.ts
├── application/
│   ├── calculateRack.use-case.ts
│   ├── createRackSet.use-case.ts
│   ├── getRackSet.use-case.ts
│   └── listRackSets.use-case.ts
├── infrastructure/
│   ├── rack.repository.ts
│   ├── rack-set.repository.ts
│   └── price.service.ts (опционально)
├── interfaces/
│   ├── rack.controller.ts
│   ├── dtos/
│   │   ├── calculate-rack.dto.ts
│   │   └── rack-response.dto.ts
│   └── middleware/
│       └── rack-ownership.middleware.ts
└── index.ts
```

---

## ✅ Критерии приёмки

- [ ] Алгоритм точно соответствует `RACK_ALGORITHM_BUSINESS.md`
- [ ] Все API endpoints возвращают корректные ответы
- [ ] RBAC permissions применены ко всем endpoints
- [ ] Пользователь может accessing только свои комплекты стеллажей
- [ ] Реализовано мягкое удаление (soft delete) для комплектов
- [ ] Ревизии создаются при каждом обновлении
- [ ] Unit-тесты проходят (>80% покрытия)
- [ ] Integration-тесты проходят
- [ ] TypeScript компиляция проходит без ошибок
- [ ] Нет ошибок или предупреждений в консоли

---

## 🔗 Связанные файлы

- `RACK_ALGORITHM_BUSINESS.md` — бизнес-алгоритм расчёта
- `plan-server.md` — общий план сервера
- `price/PRICE_DB_STRUCTURE.md` — структура базы цен (для расчёта стоимости)

---

## 📝 Примечания

- Начать с domain-логики (чистые функции, без зависимостей)
- Затем реализовать use-cases
- Затем репозитории и контроллеры
- RBAC middleware добавить в конце
- Писать тесты по ходу разработки
