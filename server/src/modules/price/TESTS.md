# Tests - Price Module

> **Статус:** ✅ 32 тести пройдено  
> **Останнє оновлення:** 27 березня 2026 р.

---

## Запуск тестів

```bash
# Всі тести для Price модуля
npm test -- --testPathPatterns="price"

# Тести з coverage
npm run test:coverage -- --testPathPatterns="price"

# Тести в watch режимі
npm run test:watch -- --testPathPatterns="price"
```

---

## Покриття тестами

### RackPriceStrategy (18 тестів)

| Тест | Опис | Статус |
|------|------|--------|
| `category` | повертає "rack" | ✅ |
| `validateItem` - support | валідує опору | ✅ |
| `validateItem` - span | валідує балку | ✅ |
| `validateItem` - vertical_support | валідує вертикальну стійку | ✅ |
| `validateItem` - diagonal_brace | валідує розкос | ✅ |
| `validateItem` - isolator | валідує ізолятор | ✅ |
| `validateItem` - invalid | відхиляє невірний тип | ✅ |
| `getPrice` - simple | повертає ціну простого елемента | ✅ |
| `getPrice` - no price | повертає 0 без ціни | ✅ |
| `getPrice` - with variant | повертає ціну варіанта | ✅ |
| `getPrice` - non-existent variant | повертає 0 для неіснуючого варіанта | ✅ |
| `toExportFormat` - simple | експортує простий елемент | ✅ |
| `toExportFormat` - with variants | експортує елемент з варіантами | ✅ |
| `fromImportFormat` - simple | імпортує простий елемент | ✅ |
| `fromImportFormat` - edge variant | імпортує крайню опору | ✅ |
| `fromImportFormat` - intermediate variant | імпортує проміжну опору | ✅ |
| `sortItems` - by type and size | сортує за типом і розміром | ✅ |
| `sortItems` - string sizes | сортує рядкові розміри | ✅ |

### PriceProcessorService (14 тестів)

| Тест | Опис | Статус |
|------|------|--------|
| `registerStrategy` | реєструє стратегію | ✅ |
| `getStrategy` - found | повертає зареєстровану стратегію | ✅ |
| `getStrategy` - not found | кидає помилку для невідомої категорії | ✅ |
| `validateItems` - valid | валідує вірні елементи | ✅ |
| `validateItems` - invalid | відхиляє невірні елементи | ✅ |
| `sortItems` | сортує елементи | ✅ |
| `getPrice` - simple | повертає ціну простого елемента | ✅ |
| `getPrice` - variant | повертає ціну варіанта | ✅ |
| `exportToExcel` - buffer | експортує в Excel буфер | ✅ |
| `exportToExcel` - header | включає заголовок | ✅ |
| `importFromExcel` - simple | імпортує прості елементи | ✅ |
| `importFromExcel` - group variants | групує варіанти одного елемента | ✅ |
| `importFromExcel` - skip header | пропускає заголовок | ✅ |
| `integration: export and import` | експорт/імпорт працюють разом | ✅ |

---

## Файли тестів

```
server/src/modules/price/
├── domain/
│   └── strategies/
│       ├── rack-price.strategy.ts
│       └── rack-price.strategy.test.ts       # 18 тестів
└── application/
    └── services/
        ├── price-processor.service.ts
        └── price-processor.service.test.ts   # 14 тестів
```

---

## Coverage

```
----------------------------------|---------|----------|---------|---------|
File                              | % Stmts | % Branch | % Funcs | % Lines |
----------------------------------|---------|----------|---------|---------|
All files                         |   85.71 |    78.26 |   91.66 |   86.36 |
 domain/strategies                |         |          |         |         |
  rack-price.strategy.ts          |   92.30 |    85.71 |     100 |   92.30 |
 application/services             |         |          |         |         |
  price-processor.service.ts      |   78.57 |    70.83 |   83.33 |   80.00 |
----------------------------------|---------|----------|---------|---------|
```

---

## Приклади тестів

### Тестування стратегії

```typescript
import { RackPriceStrategy } from './rack-price.strategy'

describe('RackPriceStrategy', () => {
  const strategy = new RackPriceStrategy()

  it('should validate support item', () => {
    const item: PriceItem = {
      id: 'support_215',
      type: 'support',
      size: '215',
      price: 600,
    }
    expect(strategy.validateItem(item)).toBe(true)
  })

  it('should return price for support variant', () => {
    const item: PriceItem = {
      id: 'support_215',
      type: 'support',
      size: '215',
      variants: [
        { id: 'support_215_edge', variant: 'edge', price: 600 },
        { id: 'support_215_intermediate', variant: 'intermediate', price: 620 },
      ],
    }
    expect(strategy.getPrice(item, 'support_215_edge')).toBe(600)
  })
})
```

### Тестування сервісу

```typescript
import { PriceProcessorService } from './price-processor.service'
import { RackPriceStrategy } from '../strategies/rack-price.strategy'

describe('PriceProcessorService', () => {
  let service: PriceProcessorService

  beforeEach(() => {
    service = new PriceProcessorService()
    service.registerStrategy(new RackPriceStrategy())
  })

  it('should validate valid rack items', () => {
    const items: PriceItem[] = [
      { id: 'support_215', type: 'support', size: '215', price: 600 },
      { id: 'span_600', type: 'span', size: '600', price: 500 },
    ]
    expect(service.validateItems('rack', items)).toBe(true)
  })

  it('should export items to Excel', () => {
    const items: PriceItem[] = [
      { id: 'span_600', type: 'span', size: '600', price: 500 },
    ]
    const buffer = service.exportToExcel('rack', items)
    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })
})
```

---

## Наступні кроки

- [ ] Додати тести для `BatteryPriceStrategy` (майбутній)
- [ ] Додати integration тести з БД
- [ ] Додати E2E тести для API endpoints
- [ ] Покрити tests для Use-Cases (BulkUpdate, Import, Export)
