# 📋 План реалізації: Sprint 5 — Модуль Rack

> **Пріоритет:** 🔴 Високий
> **Оцінка:** 1-2 тижні
> **Статус:** ⏳ Очікує початку

---

## 🎯 Мета спринту

Реалізувати повний цикл розрахунку стелажів:

- **Бекенд:** Domain-логіка → Use-Case → API
- **Фронтенд:** UI калькулятора → Форма → Результати → Збереження

---

## 📦 Етапи реалізації

### Етап 1: Бекенд — Domain Layer (2-3 дні)

#### 1.1 Value Objects

**Файли:**

- `server/src/modules/rack/domain/value-objects/Size.vo.ts`
- `server/src/modules/rack/domain/value-objects/Rows.vo.ts`
- `server/src/modules/rack/domain/value-objects/Weight.vo.ts`
- `server/src/modules/rack/domain/value-objects/Span.vo.ts`

**Що реалізувати:**

```typescript
// Size.vo.ts
export class Size {
  constructor(
    public readonly levels: number, // 1-3
    public readonly totalLength: number, // мм
  ) {
    this.validate();
  }

  private validate() {
    if (this.levels < 1 || this.levels > 3) {
      throw new Error('Levels must be between 1 and 3');
    }
    if (this.totalLength <= 0) {
      throw new Error('Total length must be positive');
    }
  }
}
```

**Перевірка:**

- ✅ Unit-тести на валідацію
- ✅ Іммутабельність (readonly)

---

#### 1.2 Domain Function: calculateRack()

**Файл:** `server/src/modules/rack/domain/calculateRack.ts`

**Алгоритм (з RACK_ALGORITHM_BUSINESS.md):**

```typescript
interface RackInput {
  levels: number;        // поверховість (1-3)
  rows: number;          // рядність (1-2)
  beamsPerRow: number;   // балок на ряд
  supportType: string;   // C80, 430, 430C
  verticalStandType?: string; // 632, 1190, 1500 (для 2+ поверхів)
  spans: Span[];         // [{type: '600mm', quantity: 2}, ...]
}

interface RackResult {
  name: string;
  components: {
    supports: { type: 'edge' | 'intermediate'; quantity: number }[];
    beams: { type: string; length: number; quantity: number }[];
    verticalStands?: { type: string; quantity: number };
    braces?: { quantity: number };
    isolators?: { quantity: number };
  };
  pricing: {
    base: number;
    withoutIsolators: number;
    zero: number;
  };
}

export function calculateRack(input: RackInput): RackResult {
  // 1. Розрахунок опор
  const totalSpans = input.spans.reduce((sum, s) => sum + s.quantity, 0);
  const edgeSupports = 2 * input.levels;
  const intermediateSupports = (totalSpans - 1) * input.levels;

  // 2. Розрахунок балок
  const beams = input.spans.map(span => ({
    type: span.type,
    length: parseInt(span.type),
    quantity: span.quantity * input.rows * input.beamsPerRow * input.levels
  }));

  // 3. Вертикальні стійки (для 2+ поверхів)
  let verticalStands;
  if (input.levels >= 2) {
    verticalStands = {
      type: input.verticalStandType!,
      quantity: (totalSpans + 1) * 2
    };
  }

  // 4. Розкоси (для 2+ поверхів)
  let braces;
  if (input.levels >= 2) {
    braces = {
      quantity: totalSpans === 1 ? 2 : (totalSpans - 1) * 2 + 2
    };
  }

  // 5. Ізолятори (для 1 поверху)
  let isolators;
  if (input.levels === 1) {
    const totalSupports = edgeSupports + intermediateSupports;
    isolators = { quantity: totalSupports * 2 };
  }

  // 6. Генерація назви
  const name = generateRackName(input);

  // 7. Розрахунок вартості (з Price DB)
  const pricing = calculatePricing({...});

  return { name, components: {...}, pricing };
}
```

**Перевірка:**

- ✅ Unit-тести на всі формули
- ✅ Тести на особливі випадки (1 проліт, 1 поверх, 2 поверхи)

---

#### 1.3 Rack Entity

**Файл:** `server/src/modules/rack/domain/entities/rack.entity.ts`

```typescript
export class RackEntity {
  id?: string;
  name: string;
  configuration: RackConfiguration;
  components: RackComponents;
  pricing: RackPricing;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<RackEntity>) {
    Object.assign(this, data);
  }

  static create(input: RackInput): RackEntity {
    const result = calculateRack(input);
    return new RackEntity({
      name: result.name,
      configuration: input,
      components: result.components,
      pricing: result.pricing,
    });
  }
}
```

---

### Етап 2: Бекенд — Infrastructure Layer (1-2 дні)

#### 2.1 Rack Repository

**Файл:** `server/src/modules/rack/infrastructure/rack.repository.ts`

```typescript
export class RackRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateRackDto): Promise<RackEntity> {
    const rack = await this.prisma.rackSet.create({
      data: {
        name: data.name,
        configuration: data.configuration,
        components: data.components,
        pricing: data.pricing,
        userId: data.userId,
      },
    });
    return this.mapToEntity(rack);
  }

  async findById(id: string): Promise<RackEntity | null> {
    const rack = await this.prisma.rackSet.findUnique({
      where: { id },
      include: { revisions: { orderBy: { createdAt: 'desc' } } },
    });
    return rack ? this.mapToEntity(rack) : null;
  }

  async findByUserId(userId: string): Promise<RackEntity[]> {
    const racks = await this.prisma.rackSet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return racks.map((r) => this.mapToEntity(r));
  }

  private mapToEntity(data: any): RackEntity {
    return new RackEntity({
      id: data.id,
      name: data.name,
      configuration: data.configuration,
      components: data.components,
      pricing: data.pricing,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
```

---

#### 2.2 Prisma Schema Update

**Файл:** `server/prisma/schema.prisma`

```prisma
model RackSet {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  configuration Json     // { levels, rows, beamsPerRow, supportType, spans }
  components    Json     // { supports, beams, verticalStands, braces, isolators }
  pricing       Json     // { base, withoutIsolators, zero }
  userId        String   @db.ObjectId
  user          User     @relation(fields: [userId], references: [id])
  revisions     RackRevision[]
  isDeleted     Boolean  @default(false)
  deletedAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
  @@map("rack_sets")
}

model RackRevision {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  rackSetId String   @db.ObjectId
  rackSet   RackSet  @relation(fields: [rackSetId], references: [id], onDelete: Cascade)
  version   Int
  data      Json     // snapshot of configuration
  createdAt DateTime @default(now())

  @@unique([rackSetId, version])
  @@map("rack_revisions")
}
```

**Міграції:**

```bash
npm run db:push
```

---

### Етап 3: Бекенд — Application Layer (1 день)

#### 3.1 Use-Case: CalculateRack

**Файл:** `server/src/modules/rack/application/use-cases/calculateRack.use-case.ts`

```typescript
interface CalculateRackInput {
  levels: number;
  rows: number;
  beamsPerRow: number;
  supportType: string;
  verticalStandType?: string;
  spans: { type: string; quantity: number }[];
}

export class CalculateRackUseCase {
  constructor(
    private rackRepository: RackRepository,
    private priceRepository: PriceRepository,
  ) {}

  async execute(input: CalculateRackInput, userId?: string): Promise<RackResult> {
    // 1. Валідація вхідних даних (Zod schema)
    const validatedInput = calculateRackSchema.parse(input);

    // 2. Domain розрахунок
    const result = calculateRack(validatedInput);

    // 3. Отримання цін з Price DB
    const prices = await this.priceRepository.getActivePrices();

    // 4. Розрахунок вартості
    const pricing = this.calculatePricing(result.components, prices);

    // 5. Збереження (якщо користувач авторизований)
    if (userId) {
      await this.rackRepository.create({
        ...result,
        pricing,
        userId,
      });
    }

    return { ...result, pricing };
  }

  private calculatePricing(components: any, prices: any): Pricing {
    // Логіка розрахунку з алгоритму
    return {
      base: 0,
      withoutIsolators: 0,
      zero: 0,
    };
  }
}
```

---

### Етап 4: Бекенд — Interfaces Layer (1 день)

#### 4.1 Rack Controller

**Файл:** `server/src/modules/rack/interfaces/rack.controller.ts`

```typescript
export class RackController {
  private router: Router;
  private useCase: CalculateRackUseCase;

  constructor(rackRepository: RackRepository, priceRepository: PriceRepository) {
    this.router = Router();
    this.useCase = new CalculateRackUseCase(rackRepository, priceRepository);
    this.initRoutes();
  }

  private initRoutes() {
    // POST /api/rack/calculate
    this.router.post(
      '/calculate',
      asyncHandler(async (req, res) => {
        const input = req.body;
        const userId = req.user?.id; // з auth middleware

        const result = await this.useCase.execute(input, userId);
        res.json(result);
      }),
    );

    // GET /api/rack/my — мої розрахунки
    this.router.get(
      '/my',
      authMiddleware,
      asyncHandler(async (req, res) => {
        const userId = req.user!.id;
        const racks = await rackRepository.findByUserId(userId);
        res.json(racks);
      }),
    );

    // GET /api/rack/:id — деталі розрахунку
    this.router.get(
      '/:id',
      authMiddleware,
      asyncHandler(async (req, res) => {
        const rack = await rackRepository.findById(req.params.id);
        if (!rack) {
          throw new NotFoundError('Rack not found');
        }
        res.json(rack);
      }),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
```

#### 4.2 Реєстрація роутів

**Файл:** `server/src/routes.ts`

```typescript
import { createRackRouter } from './modules/rack/interfaces/rack.controller.js';

export const registerRoutes = (app: Express) => {
  // ... існуючі роути

  // Rack routes
  const rackRepository = new RackRepository(prisma);
  const priceRepository = new PriceRepository(prisma);
  app.use('/api/rack', createRackRouter(rackRepository, priceRepository));
};
```

---

### Етап 5: Фронтенд — Types & Services (0.5 дня)

#### 5.1 TypeScript Types

**Файл:** `client/src/types/rack.ts`

```typescript
export interface RackConfiguration {
  levels: number;
  rows: number;
  beamsPerRow: number;
  supportType: string;
  verticalStandType?: string;
  spans: Span[];
}

export interface Span {
  type: string; // '600mm', '750mm', etc.
  quantity: number;
  length: number;
}

export interface RackComponents {
  supports: { type: 'edge' | 'intermediate'; quantity: number }[];
  beams: { type: string; length: number; quantity: number }[];
  verticalStands?: { type: string; quantity: number };
  braces?: { quantity: number };
  isolators?: { quantity: number };
}

export interface RackPricing {
  base: number;
  withoutIsolators: number;
  zero: number;
}

export interface RackResult {
  name: string;
  configuration: RackConfiguration;
  components: RackComponents;
  pricing: RackPricing;
}

export interface RackFilters {
  search?: string;
  levels?: number;
  rows?: number;
  dateFrom?: string;
  dateTo?: string;
}
```

---

#### 5.2 API Service

**Файл:** `client/src/services/rack.service.ts`

```typescript
import { apiClient } from './api.client';
import type { RackConfiguration, RackResult, RackFilters } from '@/types/rack';

export const rackService = {
  async calculate(config: RackConfiguration): Promise<RackResult> {
    const { data } = await apiClient.post('/rack/calculate', config);
    return data;
  },

  async getMyRacks(filters?: RackFilters): Promise<RackResult[]> {
    const { data } = await apiClient.get('/rack/my', { params: filters });
    return data;
  },

  async getRackById(id: string): Promise<RackResult> {
    const { data } = await apiClient.get(`/rack/${id}`);
    return data;
  },

  async deleteRack(id: string): Promise<void> {
    await apiClient.delete(`/rack/${id}`);
  },
};
```

---

### Етап 6: Фронтенд — UI Components (1-2 дні)

#### 6.1 Rack Calculator Form

**Файл:** `client/src/pages/rack/RackCalculatorPage.tsx`

**Компоненти:**

- `RackForm` — форма введення параметрів
- `SpanInput` — динамічне введення прольотів
- `RackResults` — відображення результатів
- `RackSummary` — зведення по компонентах

**Структура форми:**

```tsx
interface RackFormValues {
  levels: number;
  rows: number;
  beamsPerRow: number;
  supportType: string;
  verticalStandType?: string;
  spans: { type: string; quantity: number }[];
}

const schema = z.object({
  levels: z.number().min(1).max(3),
  rows: z.number().min(1).max(2),
  beamsPerRow: z.number().min(1),
  supportType: z.enum(['C80', '430', '430C']),
  verticalStandType: z.string().optional(),
  spans: z
    .array(
      z.object({
        type: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
});
```

---

#### 6.2 Сторінки

**Файли:**

- `client/src/pages/rack/RackCalculatorPage.tsx` — `/rack/calculator`
- `client/src/pages/rack/RackListPage.tsx` — `/rack` (список збережених)
- `client/src/pages/rack/RackDetailPage.tsx` — `/rack/:id` (деталі)

**Роутинг:**

```tsx
// client/src/App.tsx
<Route path="/rack" element={<ProtectedRoute><RackListPage /></ProtectedRoute>} />
<Route path="/rack/calculator" element={<ProtectedRoute><RackCalculatorPage /></ProtectedRoute>} />
<Route path="/rack/:id" element={<ProtectedRoute><RackDetailPage /></ProtectedRoute>} />
```

**Sidebar navigation:**

```tsx
// client/src/components/layout/Sidebar.tsx
<nav>
  <NavLink to='/dashboard'>Dashboard</NavLink>
  <NavLink to='/rack'>Стелажі</NavLink>
  <NavLink to='/rack/calculator'>Калькулятор</NavLink>
  <NavLink to='/settings'>Налаштування</NavLink>
</nav>
```

---

### Етап 7: Тестування (1 день)

#### 7.1 Backend Unit Tests

**Файл:** `server/src/modules/rack/domain/__tests__/calculateRack.test.ts`

```typescript
describe('calculateRack', () => {
  it('should calculate single-level rack correctly', () => {
    const input = {
      levels: 1,
      rows: 1,
      beamsPerRow: 2,
      supportType: 'C80',
      spans: [{ type: '600mm', quantity: 2 }],
    };

    const result = calculateRack(input);

    expect(result.components.supports).toHaveLength(2);
    expect(result.components.isolators).toBeDefined();
    expect(result.components.verticalStands).toBeUndefined();
  });

  it('should calculate multi-level rack correctly', () => {
    const input = {
      levels: 2,
      rows: 2,
      beamsPerRow: 2,
      supportType: 'C80',
      verticalStandType: '1190',
      spans: [{ type: '600mm', quantity: 3 }],
    };

    const result = calculateRack(input);

    expect(result.components.verticalStands).toBeDefined();
    expect(result.components.braces).toBeDefined();
    expect(result.components.isolators).toBeUndefined();
  });
});
```

#### 7.2 Integration Tests

**Файл:** `server/src/modules/rack/interfaces/__tests__/rack.controller.test.ts`

```typescript
describe('RackController', () => {
  it('POST /api/rack/calculate should return calculation result', async () => {
    const response = await request(app).post('/api/rack/calculate').send(validRackConfig);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('components');
    expect(response.body).toHaveProperty('pricing');
  });
});
```

---

## ✅ Чеклист готовності Sprint 5

### Бекенд

- [ ] Value Objects створені і протестовані
- [ ] Domain функція `calculateRack()` реалізована
- [ ] RackEntity створений
- [ ] RackRepository реалізований
- [ ] CalculateRackUseCase готовий
- [ ] RackController створений
- [ ] Routes зареєстровані
- [ ] Prisma schema оновлена
- [ ] Міграції виконані
- [ ] Unit-тести написані (80%+ coverage)
- [ ] Integration-тести написані

### Фронтенд

- [ ] TypeScript типи створені
- [ ] rack.service.ts реалізований
- [ ] RackCalculatorPage створений
- [ ] RackListPage створений
- [ ] RackDetailPage створений
- [ ] Роутинг налаштований
- [ ] Sidebar оновлений
- [ ] Форма валідується Zod
- [ ] Результати відображаються
- [ ] Збереження працює

### Документація

- [ ] API документація оновлена
- [ ] README оновлений
- [ ] STATUS.md оновлений

---

## 📊 Оцінка часу

| Етап                  | Завдання                    | Оцінка        |
| --------------------- | --------------------------- | ------------- |
| **1. Domain Layer**   | VO + calculateRack + Entity | 2-3 дні       |
| **2. Infrastructure** | Repository + Prisma         | 1-2 дні       |
| **3. Application**    | Use-Case                    | 1 день        |
| **4. Interfaces**     | Controller + Routes         | 1 день        |
| **5. Frontend Types** | Types + Service             | 0.5 дня       |
| **6. Frontend UI**    | Форми + Сторінки            | 1-2 дні       |
| **7. Тести**          | Unit + Integration          | 1 день        |
| **Разом**             |                             | **7-11 днів** |

---

## 🎯 Критерії приймання

1. ✅ Користувач може ввести параметри стелажа
2. ✅ Система розраховує компоненти за алгоритмом
3. ✅ Відображаються 3 типи цін (базова, без ізоляторів, нульова)
4. ✅ Результати зберігаються в БД
5. ✅ Користувач бачить історію своїх розрахунків
6. ✅ Тести покривають критичну логіку
7. ✅ Документація актуальна

---

## 🔗 Посилання

- [Алгоритм розрахунку](./RACK_ALGORITHM_BUSINESS.md)
- [Статус проєкту](./STATUS.md)
- [План розробки](./PLAN.md)
